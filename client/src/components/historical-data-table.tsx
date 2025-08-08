import { useQuery } from "@tanstack/react-query";
import { Table } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { type CPIData } from "@shared/schema";

export default function HistoricalDataTable() {
  const { data: cpiData, isLoading } = useQuery<CPIData[]>({
    queryKey: ["/api/cpi-data"],
  });

  const recentData = cpiData?.slice(0, 10) || [];

  return (
    <Card className="mt-8 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="bg-slate-100 px-8 py-4 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center">
          <Table className="mr-2 text-tunisia-blue w-5 h-5" />
          Indices des Prix à la Consommation (Sélection)
        </h3>
      </div>
      
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-tunisia-blue border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-600">Chargement des données...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Période
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Base 1990=100
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Base 2000=100
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Base 2010=100
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {recentData.map((row, index) => (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {row.month ? (
                        `${new Date(0, row.month - 1).toLocaleDateString('fr-FR', { month: 'long' })} ${row.year}`
                      ) : (
                        row.year.toString()
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {row.base1990 ? row.base1990.toFixed(1) : '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {row.base2000 ? row.base2000.toFixed(1) : '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {row.base2010 ? row.base2010.toFixed(1) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200">
          <p className="text-xs text-slate-500">
            Source : Institut National de la Statistique, Tunisie • Mise à jour : 5 juillet 2025
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
