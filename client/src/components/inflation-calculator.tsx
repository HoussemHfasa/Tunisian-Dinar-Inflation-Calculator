import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Calculator, Coins, CalendarCheck, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { inflationCalculationSchema, type InflationCalculation, type InflationResult, type CPIData } from "@shared/schema";
import ResultsDisplay from "./results-display";

export default function InflationCalculator() {
  const [result, setResult] = useState<InflationResult | null>(null);
  const { toast } = useToast();

  // Fetch available CPI data to populate year dropdowns
  const { data: cpiData, isLoading: cpiLoading } = useQuery<CPIData[]>({
    queryKey: ["/api/cpi-data"],
  });

  const form = useForm<InflationCalculation>({
    resolver: zodResolver(inflationCalculationSchema),
    defaultValues: {
      amount: 100,
      yearFrom: 2025,
      yearTo: 1990,
    },
  });

  const calculateMutation = useMutation({
    mutationFn: async (data: InflationCalculation) => {
      const response = await apiRequest("POST", "/api/calculate-inflation", data);
      return response.json();
    },
    onSuccess: (data: InflationResult) => {
      setResult(data);
      // Smooth scroll to results
      setTimeout(() => {
        const resultsElement = document.getElementById("results-section");
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    },
    onError: (error: any) => {
      toast({
        title: "Erreur de Calcul",
        description: error.message || "Impossible de calculer l'inflation. Veuillez réessayer.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InflationCalculation) => {
    calculateMutation.mutate(data);
  };

  // Extract unique years from available CPI data, sorted in descending order
  const availableYears = cpiData 
    ? Array.from(new Set(cpiData.map(d => d.year))).sort((a, b) => b - a)
    : [];

  return (
    <>
      <Card className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Calculator Header */}
        <div className="bg-gradient-to-r from-tunisia-blue to-tunisia-light px-8 py-6">
          <h2 className="text-2xl font-bold text-white mb-2">Calculateur d'Inflation TND</h2>
          <p className="text-blue-100">Découvrez la valeur équivalente de votre argent à travers le temps</p>
        </div>

        {/* Calculator Form */}
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Amount Input */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-sm font-medium text-slate-700">
                      <Coins className="text-tunisia-blue mr-2 w-4 h-4" />
                      Montant en Dinars Tunisiens
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Ex: 100"
                          min="0.01"
                          step="0.01"
                          className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-tunisia-blue focus:border-transparent transition-all duration-200 text-lg font-medium pr-16"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">
                        TND
                      </span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Years Selection Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Year From */}
                <FormField
                  control={form.control}
                  name="yearFrom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-sm font-medium text-slate-700">
                        <Calendar className="text-tunisia-blue mr-2 w-4 h-4" />
                        Année de départ
                      </FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))} 
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-tunisia-blue focus:border-transparent transition-all duration-200 text-lg">
                            <SelectValue placeholder="Sélectionner..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60">
                          {cpiLoading ? (
                            <div className="p-4 text-center text-slate-500">
                              Chargement des années disponibles...
                            </div>
                          ) : (
                            availableYears.map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Year To */}
                <FormField
                  control={form.control}
                  name="yearTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-sm font-medium text-slate-700">
                        <CalendarCheck className="text-tunisia-blue mr-2 w-4 h-4" />
                        Année de comparaison
                      </FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))} 
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-tunisia-blue focus:border-transparent transition-all duration-200 text-lg">
                            <SelectValue placeholder="Sélectionner..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60">
                          {cpiLoading ? (
                            <div className="p-4 text-center text-slate-500">
                              Chargement des années disponibles...
                            </div>
                          ) : (
                            availableYears.map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Calculate Button */}
              <Button 
                type="submit" 
                disabled={calculateMutation.isPending}
                className="w-full bg-gradient-to-r from-tunisia-blue to-tunisia-light text-white py-4 rounded-lg font-semibold text-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:ring-4 focus:ring-tunisia-blue focus:ring-opacity-30"
              >
                <Calculator className="mr-2 w-5 h-5" />
                {calculateMutation.isPending ? "Calcul en cours..." : "Calculer l'Équivalence"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Results Display */}
      {result && <ResultsDisplay result={result} />}

      {/* Loading State */}
      {calculateMutation.isPending && (
        <Card className="mt-8 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-tunisia-blue border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Calcul en cours...</h3>
            <p className="text-slate-600">Récupération des données IPC officielles</p>
          </CardContent>
        </Card>
      )}
    </>
  );
}
