import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { 
  Layers, ChevronDown, ChevronUp, Zap, Info, 
  LayoutDashboard, Calendar, ShieldAlert, Compass, Sliders, Settings,
  Search, Upload, ArrowUpRight
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [events, setEvents] = useState([]);
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [activeRole, setActiveRole] = useState("billetterie");

  // États du simulateur
  const [vipAdjustment, setVipAdjustment] = useState(10);
  const [quotaTransfer, setQuotaTransfer] = useState(30);

  useEffect(() => {
    fetchEventsAndSessions();
  }, []);

  async function fetchEventsAndSessions() {
    const { data: eventsData, error: eventsError } = await supabase.from('events').select('*');
    if (eventsError) console.error(eventsError);

    const { data: sessionsData, error: sessionsError } = await supabase.from('sessions').select('*');
    if (sessionsError) console.error(sessionsError);

    if (eventsData && sessionsData) {
      const merged = eventsData.map(evt => ({
        ...evt,
        sessions: sessionsData.filter(s => s.event_id === evt.id)
      }));
      setEvents(merged);
      if (merged.length > 0) setExpandedEvent(merged[0].id);
    }
  }

  function getYieldRecommendation(session, totalCapacity) {
    const fillRate = totalCapacity > 0 ? (session.sold_capacity / totalCapacity) * 100 : 0;
    const rms = Number(session.rms_net || 0);
    const sr = Number(session.seuil_rentabilite || 0);

    if (fillRate >= 100) {
      return {
        label: "Complet — Liste d'attente",
        badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        action: "Ouvrir une nouvelle date ou jauge supplémentaire."
      };
    }
    if (fillRate >= 80) {
      return {
        label: "Forte demande — Yield +10% recommandé",
        badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        action: "Ajuster la catégorie 1 à +10% sur les 48h à venir."
      };
    }
    if (rms < sr || fillRate < 40) {
      return {
        label: "Sous le seuil de rentabilité — Action requise",
        badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
        action: "Lancer une offre Flash (-20%) ou campagne ciblée."
      };
    }
    return {
      label: "Rythme nominal",
      badge: "bg-slate-800 text-slate-300 border-slate-700",
      action: "Conserver la grille tarifaire actuelle."
    };
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      
      {/* 1. SIDEBAR LATÉRALE */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between hidden md:flex">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500 rounded-xl text-slate-950">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-white tracking-tight">SmartBillet</h1>
              <p className="text-[10px] text-emerald-400 font-medium">x EventLens AI</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            {[
              { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
              { id: "events", label: "Événements", icon: Calendar },
              { id: "audit", label: "Audit & Sécurité", icon: ShieldAlert },
              { id: "veille", label: "Veille Concurrentielle", icon: Compass },
              { id: "simulator", label: "Simulateur", icon: Sliders },
              { id: "settings", label: "Paramètres", icon: Settings }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                    isActive ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
          <p className="text-xs font-medium text-slate-300">Statut Supabase</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] text-slate-400">Connecté</span>
          </div>
        </div>
      </aside>

      {/* ZONE PRINCIPALE */}
      <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">

        {/* HEADER / SÉLECTEUR DE RÔLE */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Layers className="text-emerald-400 w-6 h-6" />
              SmartBillet x EventLens
            </h1>
            <p className="text-slate-400 text-sm mt-1">Pilotage par représentation & Moteur de Yielding AI</p>
          </div>

          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            {[
              { id: "billetterie", label: "Resp. Billetterie" },
              { id: "producteur", label: "Producteur" },
              { id: "marketing", label: "Marketing" }
            ].map((role) => (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeRole === role.id ? "bg-emerald-500 text-slate-950 font-semibold shadow-md" : "text-slate-400 hover:text-white"
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. CARTES KPIS MACRO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative group">
            <div className="flex justify-between items-start">
              <span className="text-xs font-medium text-slate-400">RMT Net (Cible vs Réel)</span>
              <Info className="w-3.5 h-3.5 text-slate-500 hover:text-slate-300 cursor-pointer" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">31.20 € <span className="text-xs font-normal text-emerald-400">/ 30.00 €</span></div>
            <p className="text-[11px] text-emerald-400 mt-1">+4% au-dessus de la cible</p>
            <div className="absolute top-full left-0 mt-2 hidden group-hover:block w-64 p-3 bg-slate-800 text-xs text-slate-200 rounded-xl shadow-xl border border-slate-700 z-20 pointer-events-none">
              Revenu Moyen par Transaction nette d'annulations.
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative group">
            <div className="flex justify-between items-start">
              <span className="text-xs font-medium text-slate-400">Seuil Rentabilité (SR)</span>
              <Info className="w-3.5 h-3.5 text-slate-500 hover:text-slate-300 cursor-pointer" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 mt-2">Atteint (82%)</div>
            <p className="text-[11px] text-slate-400 mt-1">Couverture des coûts fixes</p>
            <div className="absolute top-full left-0 mt-2 hidden group-hover:block w-64 p-3 bg-slate-800 text-xs text-slate-200 rounded-xl shadow-xl border border-slate-700 z-20 pointer-events-none">
              Prix moyen ou jauge minimale pour amortir la représentation.
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative group">
            <div className="flex justify-between items-start">
              <span className="text-xs font-medium text-slate-400">Coût Acquisition (CAC)</span>
              <Info className="w-3.5 h-3.5 text-slate-500 hover:text-slate-300 cursor-pointer" />
            </div>
            <div className="text-2xl font-bold text-amber-400 mt-2">4.80 € / billet</div>
            <p className="text-[11px] text-amber-400/80 mt-1">Sous surveillance</p>
            <div className="absolute top-full left-0 mt-2 hidden group-hover:block w-64 p-3 bg-slate-800 text-xs text-slate-200 rounded-xl shadow-xl border border-slate-700 z-20 pointer-events-none">
              Dépense marketing divisée par le nombre de places vendues.
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative group">
            <div className="flex justify-between items-start">
              <span className="text-xs font-medium text-slate-400">Taux Annulation Net (TAN)</span>
              <Info className="w-3.5 h-3.5 text-slate-500 hover:text-slate-300 cursor-pointer" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">2.4%</div>
            <p className="text-[11px] text-emerald-400 mt-1">Optimal (&lt; 5%)</p>
            <div className="absolute top-full left-0 mt-2 hidden group-hover:block w-64 p-3 bg-slate-800 text-xs text-slate-200 rounded-xl shadow-xl border border-slate-700 z-20 pointer-events-none">
              Pourcentage de billets remboursés ou annulés.
            </div>
          </div>
        </div>

        {/* INSIGHTS IA */}
        <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-white text-base">Insights & Recommandations IA</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
              <span className="text-[10px] font-semibold text-rose-400 uppercase">Alerte SR</span>
              <p className="text-xs text-slate-200 mt-1 font-medium">Jeu. 12 Sept : RMS à 21.5 € (SR à 30 €).</p>
              <p className="text-xs text-slate-400 mt-2"><strong className="text-emerald-400">Action :</strong> Offre Flash -20% sur 48h.</p>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
              <span className="text-[10px] font-semibold text-amber-400 uppercase">Yielding</span>
              <p className="text-xs text-slate-200 mt-1 font-medium">Ven. 13 Sept : Remplissage à 97%.</p>
              <p className="text-xs text-slate-400 mt-2"><strong className="text-emerald-400">Action :</strong> Catégorie 1 à +10%.</p>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
              <span className="text-[10px] font-semibold text-emerald-400 uppercase">Optimisation</span>
              <p className="text-xs text-slate-200 mt-1 font-medium">Sam. 14 Sept : Séance complète.</p>
              <p className="text-xs text-slate-400 mt-2"><strong className="text-emerald-400">Action :</strong> Ouvrir liste d'attente.</p>
            </div>
          </div>
        </div>

        {/* VUE ÉVÉNEMENT & MULTI-SÉANCES EXISTANTE */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Catalogue Événements & Représentations</h2>
          {events.map((evt) => {
            const isExpanded = expandedEvent === evt.id;
            const soldCapacity = evt.sessions.reduce((acc, s) => acc + s.sold_capacity, 0);
            const totalRevenue = evt.sessions.reduce((acc, s) => acc + Number(s.revenue), 0);
            const fillRate = evt.total_capacity > 0 ? Math.round((soldCapacity / evt.total_capacity) * 100) : 0;
            const remainingSeats = evt.total_capacity - soldCapacity;

            return (
              <div key={evt.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div 
                  className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 cursor-pointer hover:bg-slate-800/50 transition"
                  onClick={() => setExpandedEvent(isExpanded ? null : evt.id)}
                >
                  <div>
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {evt.venue_type}
                    </span>
                    <h2 className="text-xl font-bold text-white mt-2">{evt.title}</h2>
                    <p className="text-slate-400 text-xs mt-1">{evt.date_range}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    {activeRole === "billetterie" && (
                      <>
                        <div>
                          <div className="text-xs text-slate-400">Remplissage</div>
                          <div className="text-lg font-bold text-white">{fillRate}%</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-400">Vendus</div>
                          <div className="text-lg font-bold text-white">{soldCapacity}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-400">Restants</div>
                          <div className="text-lg font-bold text-amber-400">{remainingSeats}</div>
                        </div>
                      </>
                    )}

                    {activeRole === "producteur" && (
                      <>
                        <div>
                          <div className="text-xs text-slate-400 flex items-center gap-1">
                            Recette totale
                            <div className="relative group cursor-pointer">
                              <Info className="w-3 h-3 text-slate-500 hover:text-slate-300" />
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-slate-800 text-[11px] text-slate-200 rounded-lg shadow-xl border border-slate-700 z-10 pointer-events-none">
                                Somme des chiffre d'affaires bruts générés.
                              </div>
                            </div>
                          </div>
                          <div className="text-lg font-bold text-emerald-400">{totalRevenue.toLocaleString()} €</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-400">Remplissage moy.</div>
                          <div className="text-lg font-bold text-white">{fillRate}%</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-400">Sessions</div>
                          <div className="text-lg font-bold text-white">{evt.sessions.length}</div>
                        </div>
                      </>
                    )}

                    {activeRole === "marketing" && (
                      <>
                        <div>
                          <div className="text-xs text-slate-400">Objectif Jauge</div>
                          <div className="text-lg font-bold text-white">{fillRate}% / 85%</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-400">Actions requises</div>
                          <div className="text-lg font-bold text-rose-400">
                            {evt.sessions.filter(s => (s.sold_capacity / (evt.total_capacity / evt.sessions.length)) < 0.4).length} alerte(s)
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-400">Recette Cumulée</div>
                          <div className="text-lg font-bold text-slate-200">{totalRevenue.toLocaleString()} €</div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex items-center justify-end">
                    {isExpanded ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="bg-slate-950/60 border-t border-slate-800 p-6 space-y-4">
                    {evt.sessions.map((s) => {
                      const sessionCapacity = evt.total_capacity / evt.sessions.length;
                      const rec = getYieldRecommendation(s, sessionCapacity);

                      return (
                        <div key={s.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div>
                            <div className="text-sm font-semibold text-white">{s.session_date}</div>
                            <div className="text-xs text-slate-400 mt-1 flex gap-4">
                              <span className="flex items-center gap-1">
                                RMS Net : <strong className="text-slate-200">{s.rms_net} €</strong>
                                <div className="relative group cursor-pointer">
                                  <Info className="w-3.5 h-3.5 text-slate-500 hover:text-slate-300" />
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-52 p-2 bg-slate-800 text-[11px] text-slate-200 rounded-lg shadow-xl border border-slate-700 z-10 pointer-events-none">
                                    <strong>Recette Moyenne par Siège :</strong> Recette nette divisée par le nombre de places vendues.
                                  </div>
                                </div>
                              </span>

                              <span className="flex items-center gap-1">
                                Seuil Rentabilité : <strong className="text-slate-200">{s.seuil_rentabilite} €</strong>
                                <div className="relative group cursor-pointer">
                                  <Info className="w-3.5 h-3.5 text-slate-500 hover:text-slate-300" />
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-56 p-2 bg-slate-800 text-[11px] text-slate-200 rounded-lg shadow-xl border border-slate-700 z-10 pointer-events-none">
                                    Prix moyen minimum par billet nécessaire pour amortir les coûts de la représentation.
                                  </div>
                                </div>
                              </span>

                              <span>Vendus : <strong className="text-slate-200">{s.sold_capacity} places</strong></span>
                            </div>
                          </div>

                          <div className="flex flex-col items-start md:items-end gap-1">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${rec.badge} flex items-center gap-1.5`}>
                              <Zap className="w-3.5 h-3.5" />
                              {rec.label}
                            </span>
                            <span className="text-[11px] text-slate-400 italic">
                              Action : {rec.action}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 4. SIMULATEUR DE YIELD ("MODE ET SI ?") */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Simulateur de Yield ("Mode Et Si ?")</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-2">
                  <span>Ajustement prix VIP (+/- %)</span>
                  <span className="font-bold text-emerald-400">+{vipAdjustment}%</span>
                </div>
                <input 
                  type="range" 
                  min="-20" 
                  max="30" 
                  value={vipAdjustment} 
                  onChange={(e) => setVipAdjustment(Number(e.target.value))}
                  className="w-full accent-emerald-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-2">
                  <span>Quota de report de places</span>
                  <span className="font-bold text-emerald-400">{quotaTransfer} sièges</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={quotaTransfer} 
                  onChange={(e) => setQuotaTransfer(Number(e.target.value))}
                  className="w-full accent-emerald-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-medium">Impact projeté sur le Chiffre d'Affaires</span>
              <div className="text-3xl font-bold text-emerald-400 my-2">
                +{(vipAdjustment * 850 + quotaTransfer * 35).toLocaleString()} €
              </div>
              <p className="text-[11px] text-slate-400">Projection calculée sur la base des réservations en cours.</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
