import React, { useState } from 'react';

export default function App() {
  const [activeRole, setActiveRole] = useState('Resp. Billetterie');
  const [activeTab, setActiveTab] = useState('Tableau de bord');
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);
  const [appliedYield, setAppliedYield] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 font-sans flex text-xs">
      {/* Sidebar Gauche */}
      <aside className="w-56 bg-[#0E131F] border-r border-slate-800/80 flex flex-col justify-between p-4 shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-1 py-1">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-base">
              ⌘
            </div>
            <div>
              <h2 className="font-bold text-white text-sm tracking-wide">SmartBillet</h2>
              <span className="text-[9px] text-slate-500 tracking-widest block uppercase">x EventLens AI</span>
            </div>
          </div>

          <nav className="space-y-1 text-slate-400">
            {[
              { id: 'Tableau de bord', icon: '🎛️' },
              { id: 'Événements', icon: '🎟️' },
              { id: 'Audit & Sécurité', icon: '🛡️' },
              { id: 'Veille Concurrentielle', icon: '👁️' },
              { id: 'Simulateur', icon: '🎚️' },
              { id: 'Paramètres', icon: '⚙️' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition font-medium text-[11px] ${
                  activeTab === item.id
                    ? 'bg-slate-800/80 text-white font-semibold'
                    : 'hover:bg-slate-800/40 hover:text-slate-200'
                }`}
              >
                <span className="text-sm">{item.icon}</span>
                {item.id}
              </button>
            ))}
          </nav>
        </div>

        <div className="text-[10px] text-slate-500 px-2">
          Espace de pilotage billetterie
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">SmartBillet x EventLens</h1>
            <p className="text-[10px] text-slate-400">Pilotage par représentation & Moteur de Yielding AI</p>
          </div>

          <div className="flex items-center gap-1 bg-[#131927] p-1 rounded-full border border-slate-800">
            {['Resp. Billetterie', 'Producteur', 'Marketing'].map((role) => (
              <button
                key={role}
                onClick={() => setActiveRole(role)}
                className={`px-3 py-1 rounded-full text-[10px] font-medium transition ${
                  activeRole === role
                    ? 'bg-emerald-400 text-slate-950 font-semibold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </header>

        {/* 4 cartes KPIs */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-[#131927] border border-slate-800/80 p-4 rounded-xl space-y-2">
            <span className="text-[10px] text-slate-400 font-medium">RMT Net (Cible vs Réel)</span>
            <div className="text-xl font-bold text-white">31.20 € <span className="text-[10px] font-normal text-slate-500">/ 30.00 €</span></div>
            <p className="text-[9px] text-emerald-400">+4% au-dessus de la cible</p>
          </div>

          <div className="bg-[#131927] border border-slate-800/80 p-4 rounded-xl space-y-2">
            <span className="text-[10px] text-slate-400 font-medium">Seuil Rentabilité (SR)</span>
            <div className="text-xl font-bold text-emerald-400">Atteint (82%)</div>
            <p className="text-[9px] text-slate-500">Couverture des coûts fixes</p>
          </div>

          <div className="bg-[#131927] border border-slate-800/80 p-4 rounded-xl space-y-2">
            <span className="text-[10px] text-slate-400 font-medium">Coût Acquisition (CAC)</span>
            <div className="text-xl font-bold text-amber-400">4.80 € / billet</div>
            <p className="text-[9px] text-amber-500/80">Sous surveillance</p>
          </div>

          <div className="bg-[#131927] border border-slate-800/80 p-4 rounded-xl space-y-2">
            <span className="text-[10px] text-slate-400 font-medium">Taux Annulation Net (TAN)</span>
            <div className="text-xl font-bold text-white">2.4%</div>
            <p className="text-[9px] text-emerald-400">Optimal (&lt; 5%)</p>
          </div>
        </div>

        {/* Bloc Insights & Recommandations IA mis à jour avec le vocabulaire métier */}
        <div className="bg-[#131927] border border-slate-800/80 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-semibold text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Insights & Recommandations IA
            </h3>
            <span className="text-[10px] text-slate-500">Analyse de la Vélocité de Vente</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Carte 1 : Alerte Risque Financier */}
            <div className="bg-[#0E131F] border border-slate-800/80 p-3 rounded-lg space-y-2 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
                    ALERTE RISQUE FINANCIER
                  </span>
                  <span className="text-[9px] text-slate-500">Jeu. 12 Sept.</span>
                </div>
                <p className="text-[10px] text-slate-300">
                  <strong className="text-white">Constat :</strong> Retard J-5 (-19 pts vs histo). SR à 80% non sécurisé. Jauge : 26% (130/500 pl.).
                </p>
                <p className="text-[10px] text-rose-400 font-semibold">
                  Manque à gagner estimé : -1 850 € Net
                </p>
                <p className="text-[9px] text-slate-400">
                  <strong className="text-slate-300">Levier :</strong> Transfert contingent Catégorie 2 (Vitesse : 4 pl./j vs cible 18 pl./j).
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between gap-1">
                <span className="text-[9px] text-amber-300 font-medium truncate">👉 Plan d'action : 40 sièges BilletReduc (-20%)</span>
                <button
                  onClick={() => setAppliedYield(!appliedYield)}
                  className={`px-2 py-1 rounded text-[9px] font-semibold transition shrink-0 ${
                    appliedYield ? 'bg-emerald-600 text-white' : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  }`}
                >
                  {appliedYield ? '✓ Appliqué' : 'Activer 1-clic'}
                </button>
              </div>
            </div>

            {/* Carte 2 : Opportunité Yielding Positif */}
            <div className="bg-[#0E131F] border border-slate-800/80 p-3 rounded-lg space-y-2 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
                    OPPORTUNITÉ YIELDING POSITIF
                  </span>
                  <span className="text-[9px] text-slate-500">Ven. 13 Sept.</span>
                </div>
                <p className="text-[10px] text-slate-300">
                  <strong className="text-white">Constat :</strong> Forte demande J-12. Carré Or complet à 90%. Vélocité x2.5 vs moyenne.
                </p>
                <p className="text-[9px] text-slate-400">
                  <strong className="text-slate-300">Levier :</strong> Ajustement sous-tarification sur sièges premium.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/60">
                <p className="text-[9px] text-emerald-400 font-medium">👉 Plan d'action : +5 € sur 10 der. Carré Or & basculer 15 sièges Cat 1.</p>
              </div>
            </div>

            {/* Carte 3 : Trajectoire Conforme */}
            <div className="bg-[#0E131F] border border-slate-800/80 p-3 rounded-lg space-y-2 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
                    TRAJECTOIRE CONFORME
                  </span>
                  <span className="text-[9px] text-slate-500">Sam. 14 Sept.</span>
                </div>
                <p className="text-[10px] text-slate-300">
                  <strong className="text-white">Constat :</strong> Conforme au plan de charge. Seuil de Rentabilité atteint à 102%. RMS Net : 24.50 €.
                </p>
                <p className="text-[9px] text-slate-400">
                  <strong className="text-slate-300">Levier :</strong> Maximisation marge sans commission réseau.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/60">
                <p className="text-[9px] text-slate-300 font-medium">👉 Plan d'action : Fermer réseaux tiers, ventes guichet/site propre (0% comm.).</p>
              </div>
            </div>
          </div>
        </div>

        {/* Catalogue Événements & Représentations (Garder la structure initiale complète avec les représentations) */}
        <div className="bg-[#131927] border border-slate-800/80 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-semibold text-white">Catalogue Événements & Représentations</h3>
            <span className="text-[10px] text-slate-500">1 événement actif</span>
          </div>

          <div className="border border-slate-800/80 rounded-lg overflow-hidden bg-[#0E131F]">
            <button
              onClick={() => setIsAccordionOpen(!isAccordionOpen)}
              className="w-full p-3 flex justify-between items-center hover:bg-slate-800/40 transition text-left"
            >
              <div>
                <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Théâtre classique</span>
                <h4 className="font-semibold text-white text-sm">Le Misanthrope</h4>
                <p className="text-[10px] text-slate-500">12 sept. — 04 oct. 2026</p>
              </div>
              <div className="flex items-center gap-6 text-[10px]">
                <div className="text-right">
                  <span className="text-slate-500 block">Remplissage</span>
                  <span className="text-white font-bold text-xs">26%</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Vendus</span>
                  <span className="text-white font-bold text-xs">1260</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Restants</span>
                  <span className="text-amber-400 font-bold text-xs">3540</span>
                </div>
                <span className="text-slate-500 text-xs ml-2">{isAccordionOpen ? '▲' : '▼'}</span>
              </div>
            </button>

            {isAccordionOpen && (
              <div className="border-t border-slate-800/80 divide-y divide-slate-800/60 text-[10px]">
                <div className="p-3 flex justify-between items-center bg-[#131927]/40">
                  <div>
                    <span className="font-medium text-white block">Jeu. 12 Sept. — 19h00</span>
                    <span className="text-slate-400">RMS Net: 21.5 € | SR: 30 € | Représentation: 130/500 places</span>
                  </div>
                  <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded text-[9px]">
                    Sous le seuil de rentabilité — Action requise
                  </span>
                </div>

                <div className="p-3 flex justify-between items-center bg-[#131927]/20">
                  <div>
                    <span className="font-medium text-white block">Ven. 13 Sept. — 20h00</span>
                    <span className="text-slate-400">RMS Net: 32 € | SR: 30 € | Représentation: 310/500 places</span>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[9px]">
                    Seuil de rentabilité atteint — Action disponible
                  </span>
                </div>

                <div className="p-3 flex justify-between items-center bg-[#131927]/20">
                  <div>
                    <span className="font-medium text-white block">Sam. 14 Sept. — 20h30</span>
                    <span className="text-slate-400">RMS Net: 35 € | SR: 30 € | Représentation: 480/500 places</span>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[9px]">
                    Seuil de rentabilité atteint — Action disponible
                  </span>
                </div>

                <div className="p-3 flex justify-between items-center bg-[#131927]/20">
                  <div>
                    <span className="font-medium text-white block">Dim. 15 Sept. — 15h00</span>
                    <span className="text-slate-400">RMS Net: 33.4 € | SR: 30 € | Représentation: 240/500 places</span>
                  </div>
                  <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded text-[9px]">
                    Sous le seuil de rentabilité — Action requise
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bloc Simulateur de Yield */}
        <div className="bg-[#131927] border border-slate-800/80 rounded-xl p-4 space-y-3">
          <h3 className="text-xs font-semibold text-white">Simulateur de Yield ("Mode Et Si ?")</h3>
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="col-span-2 space-y-3">
              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>Ajustement prix VIP (+15%)</span>
                  <span className="text-emerald-400">+15%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>Quota de report de places</span>
                  <span className="text-slate-300">40 places</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>
            </div>

            <div className="bg-[#0E131F] border border-slate-800 p-3 rounded-lg text-center space-y-1">
              <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Impact projeté sur le Chiffre d'Affaires</span>
              <div className="text-lg font-bold text-emerald-400">+9 550 €</div>
              <span className="text-[8px] text-slate-500 block">Projection calculée sur la base des réservations en cours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
