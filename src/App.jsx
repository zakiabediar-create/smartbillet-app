import React, { useState } from 'react';

export default function App() {
  const [activeRole, setActiveRole] = useState('Resp. Billetterie');
  const [activeTab, setActiveTab] = useState('Tableau de bord');
  // Gestion de l'ouverture des accordéons par spectacle (par ID)
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

  // Calculs dynamiques pour les insights
  const satRepresentationRMS = 35.0;
  const satCoveragePercentage = Math.round((satRepresentationRMS / calculatedSRPrice) * 100);

  const effectiveCoverage = 82;
  const isSREffectivelyReached = effectiveCoverage >= srPercentage;

  // Catalogue complet des spectacles et de leurs représentations
  const spectaclesList = [
    {
      id: 1,
      category: 'Théâtre classique',
      title: 'Le Misanthrope',
      dates: '12 sept. — 04 oct. 2026',
      fillingRate: '26%',
      soldTickets: 1260,
      remainingTickets: 3540,
      representations: [
        { id: 101, date: 'Jeu. 12 Sept. — 19h00', rmsNet: 21.5, seats: '130/500 places vendues' },
        { id: 102, date: 'Ven. 13 Sept. — 20h00', rmsNet: 32.0, seats: '310/500 places vendues' },
        { id: 103, date: 'Sam. 14 Sept. — 20h30', rmsNet: satRepresentationRMS, seats: '480/500 places vendues' },
        { id: 104, date: 'Dim. 15 Sept. — 15h00', rmsNet: 33.4, seats: '240/500 places vendues' }
      ]
    },
    {
      id: 2,
      category: 'Comédie',
      title: 'Le Dîner de Cons',
      dates: '08 oct. — 30 oct. 2026',
      fillingRate: '68%',
      soldTickets: 3100,
      remainingTickets: 1450,
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
      fillingRate: '91%',
      soldTickets: 4550,
      remainingTickets: 450,
      representations: [
        { id: 301, date: 'Jeu. 05 Nov. — 20h00', rmsNet: 42.0, seats: '490/500 places vendues' },
        { id: 302, date: 'Ven. 06 Nov. — 20h00', rmsNet: 44.5, seats: '500/500 places vendues (Complet)' }
      ]
    }
  ];

  const toggleSpectacleAccordion = (id) => {
    setOpenSpectacles(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Stratégies modulaires
  const [customStrategies, setCustomStrategies] = useState([
    { id: 1, name: 'Palier Temporel Standard', trigger: `J-5 ou moins & jauge < ${targetJ5}%`, action: `Remise -{autoPromoDiscount}% sur BilletReduc`, active: true, type: 'Modulaire' },
    { id: 2, name: 'Yielding Premium Carré Or', trigger: `Carré Or > ${yieldThreshold}%`, action: `Hausse tarifaire +{autoYieldPrice} €`, active: true, type: 'Modulaire' },
    { id: 3, name: 'Optimisation Canaux & Marge', trigger: 'Seuil de rentabilité atteint à 100%', action: 'Fermeture des réseaux tiers (0% commission)', active: false, type: 'Modulaire' },
    { id: 4, name: 'Surclassement Dynamique', trigger: 'Catégorie 1 saturée à 95%', action: 'Basculement automatique de sièges vers Carré Or', active: false, type: 'Modulaire' }
  ]);

  const [newStratName, setNewStratName] = useState('');
  const [newStratTrigger, setNewStratTrigger] = useState('');
  const [newStratAction, setNewStratAction] = useState('');

  const handleCreateStrategy = (e) => {
    e.preventDefault();
    if (!newStratName || !newStratTrigger || !newStratAction) return;

    const newStrategy = {
      id: Date.now(),
      name: newStratName,
      trigger: newStratTrigger,
      action: newStratAction,
      active: true,
      type: 'Personnalisée'
    };

    setCustomStrategies([...customStrategies, newStrategy]);
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

        {/* CONDITION D'AFFICHAGE SELON L'ONGLET ACTIF */}
        {activeTab === 'Paramètres' ? (
          /* ÉCRAN DE CONFIGURATION ET GESTION DES STRATÉGIES */
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

            {/* Bloc Seuils Globaux avec explications claires */}
            <div className="space-y-3 bg-[#0E131F] p-4 rounded-lg border border-slate-800/80">
              <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                1. Objectifs Financiers & Seuils d'Alerte Globaux
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Champ 1 */}
                <div className="space-y-1 relative">
                  <label className="text-[11px] text-slate-300 font-medium block">
                    Cible de remplissage minimum à J-5 (%) :
                  </label>
                  <input
                    type="number"
                    value={targetJ5}
                    onChange={(e) => setTargetJ5(e.target.value)}
                    className="w-full bg-[#131927] border border-slate-700 rounded px-3 py-1.5 text-white text-xs"
                  />
                  <span className="text-[9px] text-slate-500 block">En dessous de ce taux à 5 jours de la séance, l'IA déclenche une alerte.</span>
                </div>

                {/* Champ 2 */}
                <div className="space-y-1 relative">
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
                    Soit un prix net moyen de <strong>{calculatedSRPrice} €</strong> à obtenir par billet pour couvrir les coûts.
                  </span>
                </div>
              </div>
            </div>

            {/* Bloc Sélection et Activation des Stratégies Modulaires */}
            <div className="space-y-4 bg-[#0E131F] p-4 rounded-lg border border-slate-800/80">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider">2. Activation des Stratégies de Yield Management</h3>
                <span className="text-[10px] text-slate-500">
                  {customStrategies.filter(s => s.active).length} sur {customStrategies.length} stratégie(s) active(s)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {customStrategies.map((strat) => (
                  <div key={strat.id} className="bg-[#131927] border border-slate-800 p-3 rounded-lg flex flex-col justify-between space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[8px] text-slate-500 uppercase tracking-wider block">{strat.type}</span>
                        <h4 className="font-bold text-white text-xs">{strat.name}</h4>
                      </div>
                      <button
                        onClick={() => toggleStrategyStatus(strat.id)}
                        className={`text-[10px] px-2.5 py-1 rounded font-semibold transition cursor-pointer ${
                          strat.active 
                            ? 'bg-emerald-500 text-slate-950 shadow hover:bg-emerald-400' 
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                        }`}
                      >
                        {strat.active ? '✓ Activée' : 'Activer'}
                      </button>
                    </div>
                    <div className="text-[10px] text-slate-400 space-y-0.5 border-t border-slate-800/60 pt-2">
                      <p>🔍 <strong>Déclencheur :</strong> {strat.trigger}</p>
                      <p>⚡ <strong>Action automatique :</strong> {strat.action}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Formulaire de création d'une nouvelle stratégie */}
              <form onSubmit={handleCreateStrategy} className="pt-4 border-t border-slate-800 space-y-3">
                <h4 className="text-[11px] font-semibold text-white">+ Créer une règle personnalisée :</h4>
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Nom (ex: Promo de dernière minute)"
                    value={newStratName}
                    onChange={(e) => setNewStratName(e.target.value)}
                    className="bg-[#131927] border border-slate-700 rounded px-3 py-1.5 text-white text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Condition (ex: J-2 & < 50%)"
                    value={newStratTrigger}
                    onChange={(e) => setNewStratTrigger(e.target.value)}
                    className="bg-[#131927] border border-slate-700 rounded px-3 py-1.5 text-white text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Action (ex: Baisser de -30%)"
                    value={newStratAction}
                    onChange={(e) => setNewStratAction(e.target.value)}
                    className="bg-[#131927] border border-slate-700 rounded px-3 py-1.5 text-white text-xs"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-4 py-1.5 rounded text-xs transition"
                  >
                    Ajouter au catalogue des stratégies
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* VUE TABLEAU DE BORD COMPLET (Par défaut) */
          <>
            {/* 4 cartes KPIs explicites avec infobulles */}
            <div className="grid grid-cols-4 gap-4">
              {/* KPI 1 */}
              <div className="bg-[#131927] border border-slate-800/80 p-4 rounded-xl space-y-2 relative">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 font-medium">Revenu Net Moyen / Billet</span>
                  <div className="group relative flex items-center cursor-pointer">
                    <span className="h-4 w-4 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[9px] flex items-center justify-center font-bold hover:bg-emerald-500 hover:text-slate-950 transition">ⓘ</span>
                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block w-56 bg-slate-900 text-slate-200 text-[10px] p-2.5 rounded shadow-xl border border-slate-700 z-20 pointer-events-none">
                      <strong>Revenu Net Moyen :</strong> Moyenne nette réelle encaissée par billet après déduction des commissions, comparée à votre objectif cible.
                    </div>
                  </div>
                </div>
                <div className="text-xl font-bold text-white">31.20 € <span className="text-[10px] font-normal text-slate-500">/ cible 30.00 €</span></div>
                <p className="text-[9px] text-emerald-400">+4% au-dessus des prévisions</p>
              </div>

              {/* KPI 2 */}
              <div className="bg-[#131927] border border-slate-800/80 p-4 rounded-xl space-y-2 relative">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 font-medium">Point d'Équilibre (Rentabilité)</span>
                  <div className="group relative flex items-center cursor-pointer">
                    <span className="h-4 w-4 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[9px] flex items-center justify-center font-bold hover:bg-emerald-500 hover:text-slate-950 transition">ⓘ</span>
                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block w-56 bg-slate-900 text-slate-200 text-[10px] p-2.5 rounded shadow-xl border border-slate-700 z-20 pointer-events-none">
                      <strong>Point d'Équilibre :</strong> Indique si la billetterie globale couvre les coûts fixes nécessaires pour atteindre la rentabilité (point mort).
                    </div>
                  </div>
                </div>
                <div className={`text-xl font-bold ${isSREffectivelyReached ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {isSREffectivelyReached ? 'Atteint' : 'En cours'} ({effectiveCoverage}% / cible {srPercentage}%)
                </div>
                <p className="text-[9px] text-slate-500">Couverture globale des coûts fixes</p>
              </div>

              {/* KPI 3 */}
              <div className="bg-[#131927] border border-slate-800/80 p-4 rounded-xl space-y-2 relative">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 font-medium">Coût d'Acquisition (CAC)</span>
                  <div className="group relative flex items-center cursor-pointer">
                    <span className="h-4 w-4 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[9px] flex items-center justify-center font-bold hover:bg-emerald-500 hover:text-slate-950 transition">ⓘ</span>
                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block w-56 bg-slate-900 text-slate-200 text-[10px] p-2.5 rounded shadow-xl border border-slate-700 z-20 pointer-events-none">
                      <strong>Coût d'Acquisition (CAC) :</strong> Dépense marketing moyenne engagée pour vendre un billet. Surveillé pour préserver la marge nette.
                    </div>
                  </div>
                </div>
                <div className="text-xl font-bold text-amber-400">4.80 € / billet</div>
                <p className="text-[9px] text-amber-500/80">Frais marketing sous surveillance</p>
              </div>

              {/* KPI 4 */}
              <div className="bg-[#131927] border border-slate-800/80 p-4 rounded-xl space-y-2 relative">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 font-medium">Taux d'Annulation Net</span>
                  <div className="group relative flex items-center cursor-pointer">
                    <span className="h-4 w-4 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[9px] flex items-center justify-center font-bold hover:bg-emerald-500 hover:text-slate-950 transition">ⓘ</span>
                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block w-56 bg-slate-900 text-slate-200 text-[10px] p-2.5 rounded shadow-xl border border-slate-700 z-20 pointer-events-none">
                      <strong>Taux d'Annulation Net :</strong> Pourcentage de billets remboursés ou annulés sur le total des ventes. Un taux optimal reste sous les 5%.
                    </div>
                  </div>
                </div>
                <div className="text-xl font-bold text-white">2.4%</div>
                <p className="text-[9px] text-emerald-400">Niveau optimal (&lt; 5%)</p>
              </div>
            </div>

            {/* Bloc Insights & Recommandations IA avec bulle explicative */}
            <div className="bg-[#131927] border border-slate-800/80 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-semibold text-white flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Recommandations Intelligentes & Alertes Séances
                  </h3>
                  <div className="group relative flex items-center cursor-pointer">
                    <span className="h-4 w-4 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[9px] flex items-center justify-center font-bold hover:bg-emerald-500 hover:text-slate-950 transition">ⓘ</span>
                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block w-64 bg-slate-900 text-slate-200 text-[10px] p-2.5 rounded shadow-xl border border-slate-700 z-20 pointer-events-none">
                      <strong className="text-emerald-400 block mb-1">Valeur ajoutée de l'IA (EventLens) :</strong>
                      L'intelligence artificielle croise en temps réel la vélocité des ventes, l'historique de remplissage et vos seuils pour détecter les risques financiers avant qu'ils ne surviennent et proposer des actions correctives automatisées.
                    </div>
                  </div>
                </div>

                <span className="text-[10px] text-slate-500">
                  {customStrategies.filter(s => s.active).length} stratégie(s) active(s) dans le moteur
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {/* Carte 1 : Alerte Risque Financier */}
                <div className="bg-[#0E131F] border border-slate-800/80 p-3 rounded-lg space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
                        ALERTE : RISQUE FINANCIER
                      </span>
                      <span className="text-[9px] text-slate-500">Jeu. 12 Sept.</span>
                    </div>
                    <p className="text-[10px] text-slate-300">
                      <strong className="text-white">Diagnostic :</strong> Retard de vente à J-5 ({targetJ5}% cible). Seuil non sécurisé. Jauge : 26% (130/500 pl.).
                    </p>
                    <p className="text-[10px] text-rose-400 font-semibold">
                      Manque à gagner estimé : -1 850 € Net
                    </p>
                    <p className="text-[9px] text-slate-400">
                      <strong className="text-slate-300">Analyse :</strong> Vitesse trop faible (4 pl./j vs 18 pl./j requis).
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between gap-1">
                    <span className="text-[9px] text-amber-300 font-medium truncate">👉 Action : Lancer 40 places à -{autoPromoDiscount}% sur BilletReduc</span>
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
                        OPPORTUNITÉ DE HAUSSE TARIFAIRE
                      </span>
                      <span className="text-[9px] text-slate-500">Ven. 13 Sept.</span>
                    </div>
                    <p className="text-[10px] text-slate-300">
                      <strong className="text-white">Diagnostic :</strong> Forte demande à J-12. Carré Or rempli à {yieldThreshold}%. Vélocité x2.5.
                    </p>
                    <p className="text-[9px] text-slate-400">
                      <strong className="text-slate-300">Analyse :</strong> Le prix actuel est trop bas face à la forte demande.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/60">
                    <p className="text-[9px] text-emerald-400 font-medium">👉 Action : Augmenter de +{autoYieldPrice} € les 10 dern. places Carré Or.</p>
                  </div>
                </div>

                {/* Carte 3 : Trajectoire Conforme */}
                <div className="bg-[#0E131F] border border-slate-800/80 p-3 rounded-lg space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
                        SÉANCE SÉCURISÉE & CONFORME
                      </span>
                      <span className="text-[9px] text-slate-500">Sam. 14 Sept.</span>
                    </div>
                    <p className="text-[10px] text-slate-300">
                      <strong className="text-white">Diagnostic :</strong> Ventes conformes au prévisionnel. Équilibre atteint à {satCoveragePercentage}%. Revenu moyen : {satRepresentationRMS} €.
                    </p>
                    <p className="text-[9px] text-slate-400">
                      <strong className="text-slate-300">Analyse :</strong> La représentation se remplit sans aide extérieure.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/60">
                    <p className="text-[9px] text-slate-300 font-medium">👉 Action : Stopper les réseaux tiers, privilégier la vente directe (0% de commission).</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Catalogue Multi-Spectacles & Représentations */}
            <div className="bg-[#131927] border border-slate-800/80 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-semibold text-white">Catalogue des Représentations & Statut d'Équilibre</h3>
                  <div className="group relative flex items-center cursor-pointer">
                    <span className="h-4 w-4 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[9px] flex items-center justify-center font-bold hover:bg-emerald-500 hover:text-slate-950 transition">ⓘ</span>
                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block w-64 bg-slate-900 text-slate-200 text-[10px] p-2.5 rounded shadow-xl border border-slate-700 z-20 pointer-events-none">
                      <strong className="text-emerald-400 block mb-1">Catalogue de Saison :</strong>
                      Vue d'ensemble de toute la programmation. Chaque spectacle se déplie pour afficher le détail de ses représentations et leur statut d'équilibre en temps réel.
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500">{spectaclesList.length} spectacles actifs au catalogue</span>
              </div>

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
                          <div className="text-right">
                            <span className="text-slate-500 block">Remplissage global</span>
                            <span className="text-white font-bold text-xs">{spec.fillingRate}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-slate-500 block">Billets vendus</span>
                            <span className="text-white font-bold text-xs">{spec.soldTickets.toLocaleString()}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-slate-500 block">Places restantes</span>
                            <span className="text-amber-400 font-bold text-xs">{spec.remainingTickets.toLocaleString()}</span>
                          </div>
                          <span className="text-slate-500 text-xs ml-2">{isOpen ? '▲' : '▼'}</span>
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
                                  <span className="text-slate-400">Revenu net moyen : <strong>{rep.rmsNet} €</strong> | Objectif équilibre requis : <strong>{calculatedSRPrice} €</strong> | Jauge : {rep.seats}</span>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[9px] font-semibold ${
                                  isReached 
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                }`}>
                                  {isReached ? '✓ Séance équilibrée — Objectif atteint' : '⚠ Action requise — Sous l\'objectif d\'équilibre'}
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

            {/* Bloc Simulateur de Yield avec bulle explicative */}
            <div className="bg-[#131927] border border-slate-800/80 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-semibold text-white">Simulateur d'Impact Tarifaire ("Mode Et Si ?")</h3>
                <div className="group relative flex items-center cursor-pointer">
                  <span className="h-4 w-4 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[9px] flex items-center justify-center font-bold hover:bg-emerald-500 hover:text-slate-950 transition">ⓘ</span>
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block w-64 bg-slate-900 text-slate-200 text-[10px] p-2.5 rounded shadow-xl border border-slate-700 z-20 pointer-events-none">
                    <strong className="text-emerald-400 block mb-1">Mode Simulation ("Et Si ?") :</strong>
                    Testez en temps réel l'impact financier de vos décisions (hausse de prix VIP, ouverture de quotas promo) avant de les appliquer concrètement sur votre billetterie.
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="col-span-2 space-y-3">
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span>Hausse tarifaire sur les places VIP (+{autoYieldPrice}%)</span>
                      <span className="text-emerald-400">+{autoYieldPrice}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span>Volume de places basculées en promotion</span>
                      <span className="text-slate-300">40 places</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0E131F] border border-slate-800 p-3 rounded-lg text-center space-y-1">
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Impact financier net estimé</span>
                  <div className="text-lg font-bold text-emerald-400">+9 550 €</div>
                  <span className="text-[8px] text-slate-500 block">Projection calculée en temps réel selon les ventes en cours</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
