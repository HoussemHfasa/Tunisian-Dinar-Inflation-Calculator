import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { inflationCalculationSchema, type InflationResult, type CPIData } from "@shared/schema";
import { z } from "zod";
import axios from "axios";
import { parseStringPromise } from "xml2js";

// Tunisian INS API configuration
const TUNISIAN_API_URL = "https://www.ins.tn/statistiques/base-donnees-statistiques";

// Function to fetch CPI data from Tunisian INS API
async function fetchCPIFromTunisianAPI(year: number): Promise<CPIData | null> {
  try {
    // XML request structure based on user's provided example
    const xmlRequest = `<QueryMessage SourceId='C_NSO'>
   <Period>
      <Year>${year}</Year>
   </Period>
   <DataWhere>
      <Dimension Id='RDS_DICT_INDICATORS_NSO'>
         <Element>28228379</Element>
      </Dimension>
      <Dimension Id='RDS_DICT_REGIONS_NSO'>
         <Element>0</Element>
      </Dimension>
   </DataWhere>
</QueryMessage>`;

    console.log(`Attempting to fetch CPI data for year ${year} from Tunisian API...`);
    
    // Note: The actual API endpoint might be different
    // This is a placeholder implementation that will gracefully fail
    // and fall back to static data
    const response = await axios.post(TUNISIAN_API_URL, xmlRequest, {
      headers: {
        'Content-Type': 'application/xml',
        'Accept': 'application/xml',
      },
      timeout: 5000, // 5 second timeout
    });

    if (response.data) {
      // Parse XML response
      const parsedData = await parseStringPromise(response.data);
      
      // Extract CPI values from the parsed XML
      // This would need to be adjusted based on the actual XML structure
      const cpiData: CPIData = {
        year,
        base1990: parsedData?.CPI?.Base1990?.[0] || undefined,
        base2000: parsedData?.CPI?.Base2000?.[0] || undefined,
        base2010: parsedData?.CPI?.Base2010?.[0] || undefined,
      };

      console.log(`Successfully fetched CPI data for year ${year}:`, cpiData);
      return cpiData;
    }
  } catch (error: any) {
    console.log(`Failed to fetch from API for year ${year}, using static data fallback:`, error?.message || error);
    // Gracefully fail and return null to use static data
    return null;
  }
  
  return null;
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all CPI data
  app.get("/api/cpi-data", async (req, res) => {
    try {
      const data = await storage.getAllCPIData();
      res.json(data);
    } catch (error) {
      console.error("Error fetching CPI data:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des données IPC" });
    }
  });

  // Calculate inflation
  app.post("/api/calculate-inflation", async (req, res) => {
    try {
      const { amount, yearFrom, yearTo } = inflationCalculationSchema.parse(req.body);

      // Get CPI data for both years, try to fetch from API if not available
      let cpiFrom = await storage.getCPIData(yearFrom);
      let cpiTo = await storage.getCPIData(yearTo);

      // If data is missing, try to fetch from API first
      if (!cpiFrom) {
        console.log(`Attempting to fetch missing CPI data for year ${yearFrom}`);
        const fetchedData = await fetchCPIFromTunisianAPI(yearFrom);
        if (fetchedData) {
          await storage.storeCPIData([fetchedData]);
          cpiFrom = fetchedData;
        }
      }

      if (!cpiTo) {
        console.log(`Attempting to fetch missing CPI data for year ${yearTo}`);
        const fetchedData = await fetchCPIFromTunisianAPI(yearTo);
        if (fetchedData) {
          await storage.storeCPIData([fetchedData]);
          cpiTo = fetchedData;
        }
      }

      // Check again after potential API fetch
      if (!cpiFrom || !cpiTo) {
        return res.status(404).json({ 
          message: `Données IPC non disponibles pour ${!cpiFrom ? yearFrom : yearTo}. Veuillez réessayer ou utiliser des années entre 1850-2050.` 
        });
      }

      // Determine which base to use (prioritize base1990)
      let cpiFromValue: number;
      let cpiToValue: number;
      let baseYear: string;

      if (cpiFrom.base1990 && cpiTo.base1990) {
        cpiFromValue = cpiFrom.base1990;
        cpiToValue = cpiTo.base1990;
        baseYear = "1990=100";
      } else if (cpiFrom.base2000 && cpiTo.base2000) {
        cpiFromValue = cpiFrom.base2000;
        cpiToValue = cpiTo.base2000;
        baseYear = "2000=100";
      } else if (cpiFrom.base2010 && cpiTo.base2010) {
        cpiFromValue = cpiFrom.base2010;
        cpiToValue = cpiTo.base2010;
        baseYear = "2010=100";
      } else {
        return res.status(400).json({ 
          message: "Pas de base commune disponible pour ces années" 
        });
      }

      // Calculate equivalent amount
      const equivalentAmount = (cpiToValue / cpiFromValue) * amount;

      // Calculate inflation metrics
      const totalInflation = ((cpiFromValue - cpiToValue) / cpiToValue) * 100;
      const period = Math.abs(yearFrom - yearTo);
      const annualInflation = period > 0 ? Math.pow(cpiFromValue / cpiToValue, 1 / period) - 1 : 0;

      const result: InflationResult = {
        originalAmount: amount,
        equivalentAmount: Math.round(equivalentAmount * 100) / 100,
        yearFrom,
        yearTo,
        cpiFrom: cpiFromValue,
        cpiTo: cpiToValue,
        baseYear,
        totalInflation: Math.round(totalInflation * 10) / 10,
        annualInflation: Math.round(annualInflation * 1000) / 10,
        period,
        lastUpdate: new Date().toLocaleDateString('fr-FR', { 
          year: 'numeric', 
          month: 'long' 
        }),
      };

      res.json(result);
    } catch (error) {
      console.error("Error calculating inflation:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Données d'entrée invalides",
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Erreur lors du calcul de l'inflation" });
    }
  });

  // Fetch CPI data for a specific year from Tunisian API
  app.get("/api/fetch-cpi/:year", async (req, res) => {
    try {
      const year = parseInt(req.params.year);
      if (isNaN(year) || year < 1850 || year > 2050) {
        return res.status(400).json({ message: "Année invalide" });
      }

      const cpiData = await fetchCPIFromTunisianAPI(year);
      if (cpiData) {
        // Store the fetched data
        await storage.storeCPIData([cpiData]);
        res.json(cpiData);
      } else {
        // Fallback to static data
        const staticData = await storage.getCPIData(year);
        if (staticData) {
          res.json(staticData);
        } else {
          res.status(404).json({ message: `Données IPC non disponibles pour ${year}` });
        }
      }
    } catch (error) {
      console.error("Error fetching CPI data:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des données IPC" });
    }
  });

  // Fetch fresh CPI data from Tunisian API (batch endpoint)
  app.post("/api/refresh-cpi-data", async (req, res) => {
    try {
      const { years } = req.body;
      const yearList = years || [new Date().getFullYear()];
      
      const fetchedData = [];
      for (const year of yearList) {
        try {
          const cpiData = await fetchCPIFromTunisianAPI(year);
          if (cpiData) {
            fetchedData.push(cpiData);
          }
        } catch (error) {
          console.error(`Error fetching data for year ${year}:`, error);
        }
      }

      if (fetchedData.length > 0) {
        await storage.storeCPIData(fetchedData);
      }

      res.json({ 
        message: "Données IPC mises à jour avec succès",
        fetchedYears: fetchedData.map(d => d.year),
        lastUpdate: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error refreshing CPI data:", error);
      res.status(500).json({ message: "Erreur lors de la mise à jour des données IPC" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
