import React, { useState } from 'react';

export default function App() {
  const [activeRole, setActiveRole] = useState('Resp. Billetterie');
  const [activeTab, setActiveTab] = useState('Tableau de bord');
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);
  const [appliedYield, setAppliedYield] = useState(false);

  // Paramètres globaux dynamiques
  const [targetJ5, setTargetJ5] = useState(45);
  const [srPercentage, setSrPercentage] = useState(80);
  const [yieldThreshold, setYieldThreshold] = useState(90);
  const [autoYieldPrice, setAutoYieldPrice] = useState(5);
  const [autoPromoDiscount, setAutoPromoDiscount] = useState(20);

  // Calcul dynamique du Seuil de Rentabilité en euros basé sur le %
  const baseCostPrice = 37.50; 
  const calculatedSRPrice = Math.round((baseCostPrice * (srPercentage / 100)) * 10) / 10;

  // Calcul dynamique de la couverture de la 3ème séance (Sam. 14 Sept, RMS = 35 €) par rapport au SR configuré
  const satRepresentationRMS = 35.0;
  const satCoveragePercentage = Math.round((satRepresentationRMS / calculatedSRPrice) * 100);

  // Calcul de la couverture réelle globale atteinte (simulée ici à 82% de couverture effective)
  const effectiveCoverage = 82;
  const isSREffectivelyReached = effectiveCoverage >= srPercentage;

  // Liste des représentations avec leur RMS Net pour calcul dynamique du statut
  const representations = [
    { id: 1, date: 'Jeu. 12 Sept. — 19h00', rmsNet: 21.5, seats: '130/500 places' },
    { id: 2, date: 'Ven. 13 Sept. — 20h00', rmsNet: 32.0, seats: '310/500 places' },
    { id: 3, date: 'Sam. 14 Sept. — 20h30', rmsNet: satRepresentationRMS, seats: '480/500 places' },
    { id: 4, date: 'Dim. 15 Sept. — 15h00', rmsNet: 33.4, seats: '240/500 places' }
  ];

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

        {/* CONDITION D'AFFICHAGE SELON L'ONGLET ACTIF */}
        {activeTab === 'Paramètres' ? (
          /* ÉCRAN DE CONFIGURATION ET GESTION DES STRATÉGIES */
          <div className="bg-[#131927] border border-slate-800/80 rounded-xl p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-sm font-semibold text-white">⚙️ Gestion & Sélection des Stratégies de Yielding</h2>
                <p className="text-[10px] text-slate-400">Configurez les seuils globaux et activez vos règles décisionnelles métiers en direct.</p>
              </div>
              <button
                onClick={() => setActiveTab('Tableau de bord')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs transition font-medium"
              >
                ← Retour au Tableau de bord
              </button>
            </div>

            {/* Bloc Seuils Globaux avec Bulles d'information */}
            <div className="space-y-3 bg-[#0E131F] p-4 rounded-lg border border-slate-800/80">
              <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                1. Seuils d'Alerte & Objectifs Globaux
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Champ 1 */}
                <div className="space-y-1 relative">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] text-slate-300 font-medium flex items-center gap-1.5">
                      Cible de remplissage minimum à J-5 (%) :
                      <div className="group relative flex items-center cursor-pointer">
                        <span className="h-4 w-4 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[9px] flex items-center justify-center font-bold hover:bg-emerald-500 hover:text-slate-950 transition">ⓘ</span>
                        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block w-48 bg-slate-900 text-slate-200 text-[9px] p-2 rounded shadow-xl border border-slate-700 z-20 pointer-events-none">
                          Taux de remplissage visé à 5 jours de la représentation. En dessous de ce seuil, l'IA déclenche une alerte de sous-performance financière.
                        </div>
                      </div>
                    </label>
                  </div>
                  <input
                    type="number"
                    value={targetJ5}
                    onChange={(e) => setTargetJ5(e.target.value)}
                    className="w-full bg-[#131927] border border-slate-700 rounded px-3 py-1.5 text-white text-xs"
                  />
                </div>

                {/* Champ 2 */}
                <div className="space-y-1 relative">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] text-slate-300 font-medium flex items-center gap-1.5">
                      Seuil de Rentabilité (SR) de référence (%) :
                      <div className="group relative flex items-center cursor-pointer">
                        <span className="h-4 w-4 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[9px] flex items-center justify-center font-bold hover:bg-emerald-500 hover:text-slate-950 transition">ⓘ</span>
                        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block w-48 bg-slate-900 text-slate-200 text-[9px] p-2 rounded shadow-xl border border-slate-700 z-20 pointer-events-none">
                          Pourcentage des coûts fixes à couvrir impérativement pour atteindre l'équilibre financier (point mort).
                        </div>
                      </div>
                    </label>
                  </div>
                  <input
                    type="number"
                    value={srPercentage}
                    onChange={(e) => setSrPercentage(e.target.value)}
                    className="w-full bg-[#131927] border border-slate-700 rounded px-3 py-1.5 text-white text-xs"
                  />
                  <span className="text-[9px] text-slate-500 block">SR calculé en direct : {calculatedSRPrice} € par place</span>
                </div>
              </div>
            </div>

            {/* Bloc Sélection et Activation des Stratégies Modulaires */}
            <div className="space-y-4 bg-[#0E131F] p-4 rounded-lg border border-slate-800/80">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider">2. Sélection & Activation des Stratégies Modulaires</h3>
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
                      <p>⚡ <strong>Action :</strong> {strat.action}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Formulaire de création d'une nouvelle stratégie */}
              <form onSubmit={handleCreateStrategy} className="pt-4 border-t border-slate-800 space-y-3">
                <h4 className="text-[11px] font-semibold text-white">+ Créer une règle sur-mesure :</h4>
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Nom (ex: Promo Last Minute)"
                    value={newStratName}
                    onChange={(e) => setNewStratName(e.target.value)}
                    className="bg-[#131927] border border-slate-700 rounded px-3 py-1.5 text-white text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Déclencheur (ex: J-2 & < 50%)"
                    value={newStratTrigger}
                    onChange={(e) => setNewStratTrigger(e.target.value)}
                    className="bg-[#131927] border border-slate-700 rounded px-3 py-1.5 text-white text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Action (ex: Brader -30%)"
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
            {/* 4 cartes KPIs */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-[#131927] border border-slate-800/80 p-4 rounded-xl space-y-2">
                <span className="text-[10px] text-slate-400 font-medium">RMT Net (Cible vs Réel)</span>
                <div className="text-xl font-bold text-white">31.20 € <span className="text-[10px] font-normal text-slate-500">/ 30.00 €</span></div>
                <p className="text-[9px] text-emerald-400">+4% au-dessus de la cible</p>
              </div>

              <div className="bg-[#131927] border border-slate-800/80 p-4 rounded-xl space-y-2">
                <span className="text-[10px] text-slate-400 font-medium">Seuil Rentabilité (SR)</span>
                <div className={`text-xl font-bold ${isSREffectivelyReached ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {isSREffectivelyReached ? 'Atteint' : 'En cours'} ({effectiveCoverage}% / cible {srPercentage}%)
                </div>
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

            {/* Bloc Insights & Recommandations IA */}
            <div className="bg-[#131927] border border-slate-800/80 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-semibold text-white flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Insights & Recommandations IA
                </h3>
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
                        ALERTE RISQUE FINANCIER
                      </span>
                      <span className="text-[9px] text-slate-500">Jeu. 12 Sept.</span>
                    </div>
                    <p className="text-[10px] text-slate-300">
                      <strong className="text-white">Constat :</strong> Retard J-5 ({targetJ5}% cible). SR non sécurisé. Jauge : 26% (130/500 pl.).
                    </p>
                    <p className="text-[10px] text-rose-400 font-semibold">
                      Manque à gagner estimé : -1 850 € Net
                    </p>
                    <p className="text-[9px] text-slate-400">
                      <strong className="text-slate-300">Levier :</strong> Transfert contingent Catégorie 2 (Vitesse : 4 pl./j vs cible 18 pl./j).
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between gap-1">
                    <span className="text-[9px] text-amber-300 font-medium truncate">👉 Plan d'action : 40 sièges BilletReduc (-{autoPromoDiscount}%)</span>
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
                      <strong className="text-white">Constat :</strong> Forte demande J-12. Carré Or complet à {yieldThreshold}%. Vélocité x2.5.
                    </p>
                    <p className="text-[9px] text-slate-400">
                      <strong className="text-slate-300">Levier :</strong> Ajustement sous-tarification sur sièges premium.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/60">
                    <p className="text-[9px] text-emerald-400 font-medium">👉 Plan d'action : +{autoYieldPrice} € sur 10 der. Carré Or & basculer 15 sièges Cat 1.</p>
                  </div>
                </div>

                {/* Carte 3 : Trajectoire Conforme (Dynamique avec satCoveragePercentage) */}
                <div className="bg-[#0E131F] border border-slate-800/80 p-3 rounded-lg space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
                        TRAJECTOIRE CONFORME
                      </span>
                      <span className="text-[9px] text-slate-500">Sam. 14 Sept.</span>
                    </div>
                    <p className="text-[10px] text-slate-300">
                      <strong className="text-white">Constat :</strong> Conforme au plan de charge. SR atteint à {satCoveragePercentage}%. RMS Net : {satRepresentationRMS} €.
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

            {/* Catalogue Événements & Représentations */}
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
                    {representations.map((rep) => {
                      const isReached = rep.rmsNet >= calculatedSRPrice;
                      return (
                        <div key={rep.id} className="p-3 flex justify-between items-center bg-[#131927]/40">
                          <div>
                            <span className="font-medium text-white block">{rep.date}</span>
                            <span className="text-slate-400">RMS Net: {rep.rmsNet} € | SR: {calculatedSRPrice} € | Représentation: {rep.seats}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[9px] ${
                            isReached 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            {isReached ? 'Seuil de rentabilité atteint — Action disponible' : 'Sous le seuil de rentabilité — Action requise'}
                          </span>
                        </div>
                      );
                    })}
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
                      <span>Ajustement prix VIP (+{autoYieldPrice}%)</span>
                      <span className="text-emerald-400">+{autoYieldPrice}%</span>
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
          </>
        )}
      </div>
    </div>
  );
}
