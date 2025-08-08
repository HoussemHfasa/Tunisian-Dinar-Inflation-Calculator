import { CheckCircle, ChartBar, Percent, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { type InflationResult } from "@shared/schema";

interface ResultsDisplayProps {
  result: InflationResult;
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  return (
    <Card id="results-section" className="mt-8 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Results Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <CheckCircle className="mr-3 w-6 h-6" />
          Résultat du Calcul
        </h3>
      </div>

      {/* Results Content */}
      <CardContent className="p-8">
        {/* Main Result Display */}
        <div className="text-center mb-8">
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <p className="text-lg text-slate-600 mb-2">Valeur équivalente :</p>
            <div className="text-4xl font-bold text-tunisia-blue mb-2">
              {result.equivalentAmount.toLocaleString('fr-FR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })} TND
            </div>
            <p className="text-slate-700 text-lg">
              <span className="font-semibold">{result.originalAmount} TND</span> en{" "}
              <span className="font-semibold">{result.yearFrom}</span> avaient une valeur équivalente à{" "}
              <span className="font-semibold text-tunisia-blue">
                {result.equivalentAmount.toLocaleString('fr-FR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })} TND
              </span>{" "}
              en <span className="font-semibold">{result.yearTo}</span>
            </p>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* CPI Information */}
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h4 className="text-lg font-semibold text-tunisia-blue mb-4 flex items-center">
              <ChartBar className="mr-2 w-5 h-5" />
              Indices des Prix (IPC)
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">IPC {result.yearFrom} :</span>
                <span className="font-semibold">{result.cpiFrom.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">IPC {result.yearTo} :</span>
                <span className="font-semibold">{result.cpiTo.toFixed(1)}</span>
              </div>
              <div className="border-t border-blue-300 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Base utilisée :</span>
                  <span className="font-semibold text-tunisia-blue">{result.baseYear}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Inflation Rate */}
          <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
            <h4 className="text-lg font-semibold text-amber-700 mb-4 flex items-center">
              <Percent className="mr-2 w-5 h-5" />
              Taux d'Inflation
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Inflation totale :</span>
                <span className="font-semibold text-amber-700">
                  {result.totalInflation > 0 ? '+' : ''}{result.totalInflation.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Inflation annuelle :</span>
                <span className="font-semibold text-amber-700">
                  {result.annualInflation.toFixed(1)}%
                </span>
              </div>
              <div className="border-t border-amber-300 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Période :</span>
                  <span className="font-semibold">{result.period} ans</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Context */}
        <div className="mt-6 bg-slate-50 rounded-lg p-6 border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-700 mb-3 flex items-center">
            <Info className="mr-2 w-5 h-5" />
            Informations Complémentaires
          </h4>
          <div className="text-sm text-slate-600 space-y-2">
            <p>• Les données proviennent de l'Institut National de la Statistique (INS) de Tunisie</p>
            <p>• Le calcul utilise l'indice des prix à la consommation officiel</p>
            <p>• Les résultats sont indicatifs et peuvent varier selon la méthodologie utilisée</p>
            <p>• Dernière mise à jour des données : {result.lastUpdate}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
