import React, { useState } from 'react';

export default function App() {
  const [activeRole, setActiveRole] = useState('Resp. Billetterie');
  const [activeTab, setActiveTab] = useState('Tableau de bord');
  const [selectedSpectacleId, setSelectedSpectacleId] = useState('all');
  const [openSpectacles, setOpenSpectacles] = useState({ 1: true, 2: false, 3: false });
  const [appliedYield, setAppliedYield] = useState(false);

  // Paramètres globaux dynamiques
  const [targetJ5, setTargetJ5] = useState(45);
  const [srPercentage, setSrPercentage] = useState(80);
  const [yieldThreshold, setYieldThreshold] = useState(90);
  const [autoYieldPrice, setAutoYieldPrice] = useState(5);
  const [autoPromoDiscount, setAutoPromoDiscount] = useState(20);

  // Calcul dynamique du Seuil de Rentabilité en euros par billet
  const baseCostPrice = 37.50; 
  const calculatedSRPrice = Math.round((baseCostPrice * (srPercentage / 100)) * 10) / 10;

  // Catalogue complet des spectacles
  const spectaclesList = [
    {
      id: 1,
      category: 'Théâtre classique',
      title: 'Le Misanthrope',
      dates: '12 sept. — 04 oct. 2026',
      fillingRate: 26,
      soldTickets: 1260,
      remainingTickets: 3540,
      kpis: {
        rmsNet: '26.80 €',
        rmsTarget: '30.00 €',
        rmsComment: '-10% sous la cible',
        coverage: 72,
        cac: '5.20 € / billet',
        cacStatus: 'Frais marketing élevés',
        cancellation: '3.1%'
      },
      representations: [
        { id: 101, date: 'Jeu. 12 Sept. — 19h00', rmsNet: 21.5, seats: '130/500 places vendues' },
        { id: 102, date: 'Ven. 13 Sept. — 20h00', rmsNet: 32.0, seats: '310/500 places vendues' },
        { id: 103, date: 'Sam. 14 Sept. — 20h30', rmsNet: 35.0, seats: '480/500 places vendues' },
        { id: 104, date: 'Dim. 15 Sept. — 15h00', rmsNet: 33.4, seats: '240/500 places vendues' }
      ]
    },
    {
      id: 2,
      category: 'Comédie',
      title: 'Le Dîner de Cons',
      dates: '08 oct. — 30 oct. 2026',
      fillingRate: 68,
      soldTickets: 3100,
      remainingTickets: 1450,
      kpis: {
        rmsNet: '34.50 €',
        rmsTarget: '32.00 €',
        rmsComment: '+8% au-dessus des prévisions',
        coverage: 88,
        cac: '4.10 € / billet',
        cacStatus: 'Maîtrisé',
        cancellation: '2.0%'
      },
      representations: [
        { id: 201, date: 'Mer. 08 Oct. — 20h30', rmsNet: 34.0, seats: '420/500 places vendues' },
        { id: 202, date: 'Jeu. 09 Oct. — 20h30', rmsNet: 38.5, seats: '480/500 places vendues' },
        { id: 203, date: 'Ven. 10 Oct. — 21h00', rmsNet: 40.0, seats: '500/500 places vendues (Complet)' }
      ]
    },
    {
      id: 3,
      category: 'Humour / Seul-en-scène',
      title: 'Fary — Aime',
      dates: '05 nov. — 20 nov. 2026',
      fillingRate: 91,
      soldTickets: 4550,
      remainingTickets: 450,
      kpis: {
        rmsNet: '41.20 €',
        rmsTarget: '35.00 €',
        rmsComment: '+17% forte marge',
        coverage: 114,
        cac: '2.90 € / billet',
        cacStatus: 'Optimal (zéro pub tierce)',
        cancellation: '1.2%'
      },
      representations: [
        { id: 301, date: 'Jeu. 05 Nov. — 20h00', rmsNet: 42.0, seats: '490/500 places vendues' },
        { id: 302, date: 'Ven. 06 Nov. — 20h00', rmsNet: 44.5, seats: '500/500 places vendues (Complet)' }
      ]
    }
  ];

  // Données KPIs dynamiques selon la sélection
  const currentData = selectedSpectacleId === 'all' 
    ? {
        title: 'Vue Globale (Toute la Saison)',
        rmsNet: '31.20 €',
        rmsTarget: '30.00 €',
        rmsComment: '+4% au-dessus des prévisions',
        coverage: 82,
        cac: '4.80 € / billet',
        cacStatus: 'Frais marketing sous surveillance',
        cancellation: '2.4%'
      }
    : spectaclesList.find(s => s.id === Number(selectedSpectacleId)).kpis;

  // Déclaration unique de isSREffectivelyReached
  const isSREffectivelyReached = currentData.coverage >= srPercentage;

  const toggleSpectacleAccordion = (id) => {
    setOpenSpectacles(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const [customStrategies, setCustomStrategies] = useState([
    { id: 1, name: 'Palier Temporel Standard', trigger: `J-5 ou moins & jauge < ${targetJ5}%`, action: `Remise -{autoPromoDiscount}% sur BilletReduc`, active: true, type: 'Modulaire' },
    { id: 2, name: 'Yielding Premium Carré Or', trigger: `Carré Or > ${yieldThreshold}%`, action: `Hausse tarifaire +{autoYieldPrice} €`, active: true, type: 'Modulaire' }
  ]);

  const [newStratName, setNewStratName] = useState('');
  const [newStratTrigger, setNewStratTrigger] = useState('');
  const [newStratAction, setNewStratAction] = useState('');

  const handleCreateStrategy = (e) => {
    e.preventDefault();
    if (!newStratName || !newStratTrigger || !newStratAction) return;
    setCustomStrategies([...customStrategies, { id: Date.now(), name: newStratName, trigger: newStratTrigger, action: newStratAction, active: true, type: 'Personnalisée' }]);
    setNewStratName('');
    setNewStratTrigger('');
    setNewStratAction('');
  };

  const toggleStrategyStatus = (id) => {
    setCustomStrategies(customStrategies.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

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
          Pilotage et Yield Management
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">SmartBillet x EventLens</h1>
            <p className="text-[10px] text-slate-400">Assistant intelligent de pilotage de la billetterie et des tarifs</p>
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

        {activeTab === 'Paramètres' ? (
          <div className="bg-[#131927] border border-slate-800/80 rounded-xl p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-sm font-semibold text-white">⚙️ Configuration des Règles & Objectifs de Billetterie</h2>
                <p className="text-[10px] text-slate-400">Ajustez vos seuils d'alerte et activez les automatismes de tarification selon votre saison.</p>
              </div>
              <button
                onClick={() => setActiveTab('Tableau de bord')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs transition font-medium"
              >
                ← Retour au Tableau de bord
              </button>
            </div>

            <div className="space-y-3 bg-[#0E131F] p-4 rounded-lg border border-slate-800/80">
              <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                1. Objectifs Financiers & Seuils d'Alerte Globaux
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-300 font-medium block">
                    Cible de remplissage minimum à J-5 (%) :
                  </label>
                  <input
                    type="number"
                    value={targetJ5}
                    onChange={(e) => setTargetJ5(e.target.value)}
                    className="w-full bg-[#131927] border border-slate-700 rounded px-3 py-1.5 text-white text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-300 font-medium block">
                    Objectif de Point d'Équilibre / Rentabilité (%) :
                  </label>
                  <input
                    type="number"
                    value={srPercentage}
                    onChange={(e) => setSrPercentage(e.target.value)}
                    className="w-full bg-[#131927] border border-slate-700 rounded px-3 py-1.5 text-white text-xs"
                  />
                  <span className="text-[9px] text-slate-500 block">
                    Soit un prix net moyen de <strong>{calculatedSRPrice} €</strong> à obtenir par billet.
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Sélecteur de Spectacle */}
            <div className="bg-[#131927] border border-slate-800/80 p-3 rounded-xl flex items-center justify-between">
              <span className="text-slate-400 font-medium">🎭 Filtrer le tableau de bord par spectacle :</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedSpectacleId('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    selectedSpectacleId === 'all' ? 'bg-emerald-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Vue Globale (Saison)
                </button>
                {spectaclesList.map((spec) => (
                  <button
                    key={spec.id}
                    onClick={() => setSelectedSpectacleId(spec.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      selectedSpectacleId === spec.id ? 'bg-emerald-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {spec.title}
                  </button>
                ))}
              </div>
            </div>

            {/* 4 cartes KPIs dynamiques */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-[#131927] border border-slate-800/80 p-4 rounded-xl space-y-2">
                <span className="text-[10px] text-slate-400 font-medium">Revenu Net Moyen / Billet</span>
                <div className="text-xl font-bold text-white">{currentData.rmsNet} <span className="text-[10px] font-normal text-slate-500">/ cible {currentData.rmsTarget}</span></div>
                <p className="text-[9px] text-emerald-400">{currentData.rmsComment}</p>
              </div>

              <div className="bg-[#131927] border border-slate-800/80 p-4 rounded-xl space-y-2">
                <span className="text-[10px] text-slate-400 font-medium">Point d'Équilibre (Rentabilité)</span>
                <div className={`text-xl font-bold ${isSREffectivelyReached ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {isSREffectivelyReached ? 'Atteint' : 'En cours'} ({currentData.coverage}% / cible {srPercentage}%)
                </div>
                <p className="text-[9px] text-slate-500">Couverture globale des coûts fixes</p>
              </div>

              <div className="bg-[#131927] border border-slate-800/80 p-4 rounded-xl space-y-2">
                <span className="text-[10px] text-slate-400 font-medium">Coût d'Acquisition (CAC)</span>
                <div className="text-xl font-bold text-amber-400">{currentData.cac}</div>
                <p className="text-[9px] text-amber-500/80">{currentData.cacStatus}</p>
              </div>

              <div className="bg-[#131927] border border-slate-800/80 p-4 rounded-xl space-y-2">
                <span className="text-[10px] text-slate-400 font-medium">Taux d'Annulation Net</span>
                <div className="text-xl font-bold text-white">{currentData.cancellation}</div>
                <p className="text-[9px] text-emerald-400">Niveau optimal (&lt; 5%)</p>
              </div>
            </div>

            {/* Catalogue Multi-Spectacles */}
            <div className="bg-[#131927] border border-slate-800/80 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-semibold text-white">Catalogue des Représentations & Statut d'Équilibre</h3>
              <div className="space-y-3">
                {spectaclesList.map((spec) => {
                  const isOpen = openSpectacles[spec.id];
                  return (
                    <div key={spec.id} className="border border-slate-800/80 rounded-lg overflow-hidden bg-[#0E131F]">
                      <button
                        onClick={() => toggleSpectacleAccordion(spec.id)}
                        className="w-full p-3 flex justify-between items-center hover:bg-slate-800/40 transition text-left cursor-pointer"
                      >
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase tracking-wider block">{spec.category}</span>
                          <h4 className="font-semibold text-white text-sm">{spec.title}</h4>
                          <p className="text-[10px] text-slate-500">{spec.dates}</p>
                        </div>
                        <div className="flex items-center gap-6 text-[10px]">
                          <span className="text-white font-bold text-xs">{spec.fillingRate}% rempli</span>
                          <span className="text-slate-500 text-xs">{isOpen ? '▲' : '▼'}</span>
                        </div>
                      </button>

                      {isOpen && (
                        <div className="border-t border-slate-800/80 divide-y divide-slate-800/60 text-[10px]">
                          {spec.representations.map((rep) => {
                            const isReached = rep.rmsNet >= calculatedSRPrice;
                            return (
                              <div key={rep.id} className="p-3 flex justify-between items-center bg-[#131927]/40">
                                <div>
                                  <span className="font-medium text-white block">{rep.date}</span>
                                  <span className="text-slate-400">Revenu net moyen : <strong>{rep.rmsNet} €</strong> | Objectif : <strong>{calculatedSRPrice} €</strong></span>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[9px] font-semibold ${
                                  isReached ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                }`}>
                                  {isReached ? '✓ Séance équilibrée' : '⚠ Action requise'}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
