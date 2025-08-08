import { Database, ChartLine } from "lucide-react";
import InflationCalculator from "@/components/inflation-calculator";
import HistoricalDataTable from "@/components/historical-data-table";

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-tunisia-blue rounded-lg">
                <ChartLine className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">Valeur Dinar Historique</h1>
                <p className="text-sm text-slate-600">Calculateur d'inflation officiel</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <Database className="text-tunisia-blue w-4 h-4" />
              <span>Données INS Tunisie</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <InflationCalculator />
        <HistoricalDataTable />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">À Propos</h4>
              <p className="text-sm text-slate-600">
                Calculateur d'inflation officiel utilisant les données de l'Institut National de la Statistique de Tunisie.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Sources de Données</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Institut National de la Statistique (INS)</li>
                <li>• Indices des Prix à la Consommation</li>
                <li>• Données historiques 1850-2050</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Contact</h4>
              <div className="text-sm text-slate-600 space-y-1">
                <p>Pour questions techniques ou données</p>
                <p className="text-tunisia-blue">support@valeur-dinar.tn</p>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-6 mt-6 text-center text-sm text-slate-500">
            <p>&copy; 2025 Valeur Dinar Historique. Données officielles INS Tunisie.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
