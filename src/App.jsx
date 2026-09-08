import React, { useState } from 'react';

export default function App() {
  const [activeRole, setActiveRole] = useState('Resp. Billetterie');
  const [activeTab, setActiveTab] = useState('Tableau de bord');
  const [selectedSpectacleId, setSelectedSpectacleId] = useState('all');
  const [openSpectacles, setOpenSpectacles] = useState({ 1: true, 2: false, 3: false });
  const [autoYieldPrice, setAutoYieldPrice] = useState(5);
  const [appliedYield, setAppliedYield] = useState(false);

  // Paramètres globaux de billetterie
  const [venueType, setVenueType] = useState('Théâtre');
  const [defaultProfile, setDefaultProfile] = useState('Responsable Billetterie');

  // Toggles de notifications
  const [notifRentability, setNotifRentability] = useState(true);
  const [notifWeekly, setNotifWeekly] = useState(true);

  // Modèles économiques par spectacle avec répartition intelligente
  const [spectacleSettings, setSpectacleSettings] = useState({
    1: { 
      title: 'Le Misanthrope', 
      totalBudget: 119010, 
      totalCap: 5000, 
      catOr: 55, catOrSeats: 1004, 
      cat1: 38, cat1Seats: 2500, 
      cat2: 22, cat2Seats: 1496, 
      srTarget: 85, sold: 1260, rmsNetNum: 26.8 
    },
    2: { 
      title: 'Le Dîner de Cons', 
      totalBudget: 106000, 
      totalCap: 4550, 
      catOr: 50, catOrSeats: 1138, 
      cat1: 35, cat1Seats: 2047, 
      cat2: 20, cat2Seats: 1365, 
      srTarget: 75, sold: 3100, rmsNetNum: 34.5 
    },
    3: { 
      title: 'Fary — Aime', 
      totalBudget: 133000, 
      totalCap: 5000, 
      catOr: 60, catOrSeats: 1500, 
      cat1: 42, cat1Seats: 2000, 
      cat2: 25, cat2Seats: 1500, 
      srTarget: 70, sold: 4550, rmsNetNum: 41.2 
    }
  });

  const handleSeatChange = (id, changedCat, newSeatsValue) => {
    setSpectacleSettings(prev => {
      const spec = prev[id];
      const totalCap = spec.totalCap;
      let val = Math.max(0, Number(newSeatsValue));
      if (val > totalCap) val = totalCap;

      let updated = { ...spec };

      if (changedCat === 'or') {
        const remaining = totalCap - val;
        const currentOtherSum = spec.cat1Seats + spec.cat2Seats;
        updated.catOrSeats = val;
        if (currentOtherSum > 0) {
          updated.cat1Seats = Math.round(remaining * (spec.cat1Seats / currentOtherSum));
          updated.cat2Seats = remaining - updated.cat1Seats;
        } else {
          updated.cat1Seats = Math.round(remaining / 2);
          updated.cat2Seats = remaining - updated.cat1Seats;
        }
      } else if (changedCat === 'cat1') {
        const remaining = totalCap - spec.catOrSeats - val;
        updated.cat1Seats = val;
        updated.cat2Seats = Math.max(0, remaining);
      } else if (changedCat === 'cat2') {
        updated.cat2Seats = val;
      }

      return { ...prev, [id]: updated };
    });
  };

  const handleSpectacleSettingChange = (id, field, value) => {
    setSpectacleSettings(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: Number(value) }
    }));
  };

  // Catalogue complet des spectacles avec leurs recommandations spécifiques
  const spectaclesList = [
    {
      id: 1,
      category: 'Théâtre classique',
      title: 'Le Misanthrope',
      dates: '12 sept. — 04 oct. 2026',
      fillingRate: '26%',
      soldCount: 1260,
      totalCap: 5000,
      remainingTickets: '3 540',
      networks: { guichet: '567 pl. (45%)', billetterieReduc: '441 pl. (35%)', fnacReseau: '252 pl. (20%)' },
      recommendations: [
        {
          type: 'alert',
          badge: 'ALERTE : RISQUE FINANCIER',
          date: 'Jeu. 12 Sept.',
          diagnostic: 'Retard de vente à J-5 (45% cible). Jauge : 26% (130/500 pl.)',
          detail: 'Manque à gagner estimé : -1 850 € Net',
          actionText: '⚡ Action : 40 places à -20% sur BilletReduc',
          actionable: true
        },
        {
          type: 'opportunity',
          badge: 'OPPORTUNITÉ DE HAUSSE TARIFAIRE',
          date: 'Ven. 13 Sept.',
          diagnostic: 'Forte demande à J-12. Carré Or rempli à 90%.',
          detail: '',
          actionText: '⚡ Action : +5 € sur 10 dern. places Carré Or.',
          actionable: false
        },
        {
          type: 'secure',
          badge: 'SÉANCE SÉCURISÉE & CONFORME',
          date: 'Sam. 14 Sept.',
          diagnostic: 'Ventes conformes. Équilibre atteint à 117%.',
          detail: '',
          actionText: '⚡ Action : Stopper les réseaux tiers (0% comm.).',
          actionable: false
        }
      ],
      representations: [
        { id: 101, date: 'Jeu. 12 Sept. — 19h00', rmsNet: 21.5, seats: '130/500 places vendues', alert: true },
        { id: 102, date: 'Ven. 13 Sept. — 20h00', rmsNet: 32.0, seats: '310/500 places vendues', alert: false },
        { id: 103, date: 'Sam. 14 Sept. — 20h30', rmsNet: 35.0, seats: '480/500 places vendues', alert: false },
        { id: 104, date: 'Dim. 15 Sept. — 15h00', rmsNet: 33.4, seats: '240/500 places vendues', alert: false }
      ]
    },
    {
      id: 2,
      category: 'Comédie',
      title: 'Le Dîner de Cons',
      dates: '08 oct. — 30 oct. 2026',
      fillingRate: '68%',
      soldCount: 3100,
      totalCap: 4550,
      remainingTickets: '1 450',
      networks: { guichet: '1 860 pl. (60%)', billetterieReduc: '775 pl. (25%)', fnacReseau: '465 pl. (15%)' },
      recommendations: [
        {
          type: 'secure',
          badge: 'SÉANCE STABLE & RÉGULIÈRE',
          date: 'Mer. 08 Oct.',
          diagnostic: 'Vélocité des ventes conforme aux prévisions à J-30.',
          detail: 'Objectif RMT atteint (34 € net).',
          actionText: '⚡ Action : Maintenir le plan de communication actuel.',
          actionable: false
        },
        {
          type: 'opportunity',
          badge: 'OPPORTUNITÉ DE COMPLEMENT',
          date: 'Jeu. 09 Oct.',
          diagnostic: '96% de la jauge atteinte. Fort engouement public.',
          detail: '',
          actionText: '⚡ Action : Ouvrir les strapontins de dernière minute (+20 pl.).',
          actionable: false
        },
        {
          type: 'secure',
          badge: 'SÉANCE COMPLÈTE',
          date: 'Ven. 10 Oct.',
          diagnostic: 'Guichet fermé atteint 3 semaines avant la représentation.',
          detail: '',
          actionText: '⚡ Action : Activer une liste d\'attente numérique.',
          actionable: false
        }
      ],
      representations: [
        { id: 201, date: 'Mer. 08 Oct. — 20h30', rmsNet: 34.0, seats: '420/500 places vendues', alert: false },
        { id: 202, date: 'Jeu. 09 Oct. — 20h30', rmsNet: 38.5, seats: '480/500 places vendues', alert: false },
        { id: 203, date: 'Ven. 10 Oct. — 21h00', rmsNet: 40.0, seats: '500/500 places vendues (Complet)', alert: false }
      ]
    },
    {
      id: 3,
      category: 'Humour / Seul-en-scène',
      title: 'Fary — Aime',
      dates: '05 nov. — 20 nov. 2026',
      fillingRate: '91%',
      soldCount: 4550,
      totalCap: 5000,
      remainingTickets: '450',
      networks: { guichet: '3 640 pl. (80%)', billetterieReduc: '455 pl. (10%)', fnacReseau: '455 pl. (10%)' },
      recommendations: [
        {
          type: 'opportunity',
          badge: 'FORTE PERFORMANCE',
          date: 'Jeu. 05 Nov.',
          diagnostic: 'Succès critique et public. Taux de remplissage exceptionnel.',
          detail: 'RMT net atteint : 42 € (Cible : 38 €).',
          actionText: '⚡ Action : Aucune modification requise, exploitation optimale.',
          actionable: false
        },
        {
          type: 'secure',
          badge: 'SEUIL DE RENTABILITÉ DÉPASSÉ',
          date: 'Ven. 06 Nov.',
          diagnostic: 'Complet depuis plus d\'un mois. Rentabilité assurée à 140%.',
          detail: '',
          actionText: '⚡ Action : Verrouiller les quotas partenaires.',
          actionable: false
        }
      ],
      representations: [
        { id: 301, date: 'Jeu. 05 Nov. — 20h00', rmsNet: 42.0, seats: '490/500 places vendues', alert: false },
        { id: 302, date: 'Ven. 06 Nov. — 20h00', rmsNet: 44.5, seats: '500/500 places vendues (Complet)', alert: false }
      ]
    }
  ];

  const calculateTargetRmt = (spec) => {
    const targetSoldSeats = spec.totalCap * (spec.srTarget / 100);
    if (targetSoldSeats === 0) return 0;
    return Math.round((spec.totalBudget / targetSoldSeats) * 10) / 10;
  };

  const totalSoldTickets = Object.values(spectacleSettings).reduce((acc, s) => acc + s.sold, 0);
  const totalCapacity = Object.values(spectacleSettings).reduce((acc, s) => acc + s.totalCap, 0);
  const globalFillingRate = Math.round((totalSoldTickets / totalCapacity) * 100) + '%';

  const weightedRmtSum = Object.values(spectacleSettings).reduce((acc, s) => acc + (s.sold * s.rmsNetNum), 0);
  const globalWeightedRmt = (weightedRmtSum / totalSoldTickets).toFixed(2);

  const weightedCoverageSum = Object.values(spectacleSettings).reduce((acc, s) => {
    let specCoverage = s.sold === 1260 ? 72 : s.sold === 3100 ? 88 : 114;
    return acc + (s.sold * specCoverage);
  }, 0);
  const globalCoverage = Math.round(weightedCoverageSum / totalSoldTickets);

  const weightedTargetRmtSum = Object.values(spectacleSettings).reduce((acc, s) => {
    const specTargetRmt = calculateTargetRmt(s);
    return acc + (s.sold * specTargetRmt);
  }, 0);
  const globalTargetRmt = Math.round(weightedTargetRmtSum / totalSoldTickets);

  const globalTargetSr = Math.round(Object.values(spectacleSettings).reduce((acc, s) => acc + s.srTarget, 0) / 3);

  const totalGuichet = 567 + 1860 + 3640;
  const totalBilletReduc = 441 + 775 + 455;
  const totalFnac = 252 + 465 + 455;

  const globalData = {
    fillingRate: globalFillingRate,
    soldTicketsText: `${totalSoldTickets.toLocaleString()} / ${totalCapacity.toLocaleString()} pl.`,
    rmsNet: `${globalWeightedRmt} €`,
    coverage: globalCoverage,
    targetRmtVal: globalTargetRmt,
    targetSr: globalTargetSr,
    networks: { 
      guichet: `${totalGuichet.toLocaleString()} pl. (68%)`, 
      billetterieReduc: `${totalBilletReduc.toLocaleString()} pl. (19%)`, 
      fnacReseau: `${totalFnac.toLocaleString()} pl. (13%)` 
    }
  };

  const currentSpectacleData = selectedSpectacleId === 'all' 
    ? null
    : (() => {
        const spec = spectacleSettings[selectedSpectacleId];
        const specListObj = spectaclesList.find(s => s.id === Number(selectedSpectacleId));
        const specTargetRmt = calculateTargetRmt(spec);
        const specCoverage = spec.sold === 1260 ? 72 : spec.sold === 3100 ? 88 : 114;
        return {
          ...specListObj,
          fillingRate: specListObj.fillingRate,
          soldTicketsText: `${specListObj.soldCount} / ${spec.totalCap} pl.`,
          rmsNet: spec.rmsNetNum.toFixed(2) + ' €',
          coverage: specCoverage,
          targetRmtVal: specTargetRmt,
          targetSr: spec.srTarget,
          budget: spec.totalBudget,
          networks: specListObj.networks
        };
      })();

  const globalIsReached = globalData.coverage >= globalData.targetSr;
  const specIsReached = currentSpectacleData ? currentSpectacleData.coverage >= currentSpectacleData.targetSr : false;

  // Calcul dynamique des places Carré Or pour le simulateur ("Mode Et Si ?")
  const activeCatOrSeats = selectedSpectacleId === 'all'
    ? Object.values(spectacleSettings).reduce((acc, s) => acc + s.catOrSeats, 0) // Somme de tous les carrés or en vue globale
    : spectacleSettings[selectedSpectacleId].catOrSeats;

  const activeSimulatorName = selectedSpectacleId === 'all'
    ? 'Ensemble de la Saison (Tous spectacles)'
    : spectacleSettings[selectedSpectacleId].title;

  const simulatorImpact = autoYieldPrice * activeCatOrSeats;

  // Sélection des recommandations à afficher
  const activeRecommendations = selectedSpectacleId === 'all'
    ? spectaclesList.flatMap(s => s.recommendations).slice(0, 3)
    : spectaclesList.find(s => s.id === Number(selectedSpectacleId))?.recommendations || [];

  const toggleSpectacleAccordion = (id) => {
    setOpenSpectacles(prev => ({ ...prev, [id]: !prev[id] }));
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
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition font-medium text-[11px] cursor-pointer ${
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
                className={`px-3 py-1 rounded-full text-[10px] font-medium transition cursor-pointer ${
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
          /* ONGLET PARAMÈTRES */
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="text-sm font-semibold text-white">Paramètres de la Billetterie</h2>
              <p className="text-[10px] text-slate-400">Configurez la capacité de la salle, les budgets et la ventilation en nombre de places par catégorie.</p>
            </div>

            {/* Carte Établissement */}
            <div className="bg-[#131927] border border-slate-800/80 rounded-xl p-5 space-y-4">
              <h3 className="text-xs font-semibold text-white">Établissement & Contexte</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-300 font-medium block">Type d'établissement</label>
                  <select
                    value={venueType}
                    onChange={(e) => setVenueType(e.target.value)}
                    className="w-full bg-[#0E131F] border border-slate-700 rounded px-3 py-2 text-white text-xs cursor-pointer"
                  >
                    <option value="Théâtre">Théâtre</option>
                    <option value="Opéra">Opéra</option>
                    <option value="Salle de Concert">Salle de Concert</option>
                    <option value="Festival">Festival</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-300 font-medium block">Profil métier</label>
                  <select
                    value={defaultProfile}
                    onChange={(e) => setDefaultProfile(e.target.value)}
                    className="w-full bg-[#0E131F] border border-slate-700 rounded px-3 py-2 text-white text-xs cursor-pointer"
                  >
                    <option value="Responsable Billetterie">Responsable Billetterie</option>
                    <option value="Producteur">Producteur</option>
                    <option value="Responsable Marketing">Responsable Marketing</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Carte Budgets, Capacités & Ventilation intelligente */}
            <div className="bg-[#131927] border border-slate-800/80 rounded-xl p-5 space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-white">Modèles Économiques & Ventilation par Catégorie (en places)</h3>
                <p className="text-[10px] text-slate-400">Modifiez le nombre de places d'une catégorie : les autres catégories s'ajustent automatiquement pour respecter la jauge totale.</p>
              </div>

              <div className="space-y-5 pt-1">
                {Object.keys(spectacleSettings).map((id) => {
                  const spec = spectacleSettings[id];
                  const calculatedRmt = calculateTargetRmt(spec);
                  
                  const cap = spec.totalCap || 1;
                  const orPct = Math.round((spec.catOrSeats / cap) * 100);
                  const cat1Pct = Math.round((spec.cat1Seats / cap) * 100);
                  const cat2Pct = Math.max(0, 100 - (orPct + cat1Pct));

                  const avgPrice = Math.round((spec.catOr * (orPct/100) + spec.cat1 * (cat1Pct/100) + spec.cat2 * (cat2Pct/100)));

                  return (
                    <div key={id} className="bg-[#0E131F] border border-slate-800 p-4 rounded-lg space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                        <h4 className="font-bold text-white text-xs">{spec.title}</h4>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-emerald-400 font-medium">RMT Cible Calculé : <strong>{calculatedRmt} €</strong></span>
                          <span className="text-[10px] text-slate-400">| Panier moyen macro : ~{avgPrice} €</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-400 block">Capacité Vendable (places) :</label>
                          <input
                            type="number"
                            value={spec.totalCap}
                            onChange={(e) => handleSpectacleSettingChange(id, 'totalCap', e.target.value)}
                            className="w-full bg-[#131927] border border-slate-700 rounded px-2.5 py-1.5 text-white text-xs font-semibold"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-400 block">Budget Total des Charges (€) :</label>
                          <input
                            type="number"
                            value={spec.totalBudget}
                            onChange={(e) => handleSpectacleSettingChange(id, 'totalBudget', e.target.value)}
                            className="w-full bg-[#131927] border border-slate-700 rounded px-2.5 py-1.5 text-white text-xs"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-400 block">Objectif Remplissage (%) :</label>
                          <input
                            type="number"
                            value={spec.srTarget}
                            onChange={(e) => handleSpectacleSettingChange(id, 'srTarget', e.target.value)}
                            className="w-full bg-[#131927] border border-slate-700 rounded px-2.5 py-1.5 text-white text-xs"
                          />
                        </div>
                      </div>

                      {/* Répartition par catégorie avec rééquilibrage automatique */}
                      <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-800/60">
                        <div className="bg-[#131927] p-2.5 rounded border border-slate-800 space-y-1.5">
                          <div className="flex justify-between text-[9px] text-slate-400">
                            <span>Carré Or</span>
                            <span className="text-emerald-400 font-bold">{orPct}% de la jauge</span>
                          </div>
                          <div className="flex gap-2 items-center">
                            <div className="w-1/2 relative">
                              <input type="number" value={spec.catOr} onChange={(e) => handleSpectacleSettingChange(id, 'catOr', e.target.value)} className="w-full bg-[#0E131F] border border-slate-700 rounded px-1.5 py-1 text-white text-[10px] pr-4" />
                              <span className="absolute right-1.5 top-1 text-[9px] text-slate-500">€</span>
                            </div>
                            <div className="w-1/2 relative">
                              <input type="number" value={spec.catOrSeats} onChange={(e) => handleSeatChange(id, 'or', e.target.value)} className="w-full bg-[#0E131F] border border-slate-700 rounded px-1.5 py-1 text-white text-[10px] pr-5" />
                              <span className="absolute right-1.5 top-1 text-[9px] text-slate-500">pl.</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-[#131927] p-2.5 rounded border border-slate-800 space-y-1.5">
                          <div className="flex justify-between text-[9px] text-slate-400">
                            <span>1ère Catégorie</span>
                            <span className="text-emerald-400 font-bold">{cat1Pct}% de la jauge</span>
                          </div>
                          <div className="flex gap-2 items-center">
                            <div className="w-1/2 relative">
                              <input type="number" value={spec.cat1} onChange={(e) => handleSpectacleSettingChange(id, 'cat1', e.target.value)} className="w-full bg-[#0E131F] border border-slate-700 rounded px-1.5 py-1 text-white text-[10px] pr-4" />
                              <span className="absolute right-1.5 top-1 text-[9px] text-slate-500">€</span>
                            </div>
                            <div className="w-1/2 relative">
                              <input type="number" value={spec.cat1Seats} onChange={(e) => handleSeatChange(id, 'cat1', e.target.value)} className="w-full bg-[#0E131F] border border-slate-700 rounded px-1.5 py-1 text-white text-[10px] pr-5" />
                              <span className="absolute right-1.5 top-1 text-[9px] text-slate-500">pl.</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-[#131927] p-2.5 rounded border border-slate-800 space-y-1.5">
                          <div className="flex justify-between text-[9px] text-slate-400">
                            <span>2ème Catégorie</span>
                            <span className="text-emerald-400 font-bold">{cat2Pct}% de la jauge</span>
                          </div>
                          <div className="flex gap-2 items-center">
                            <div className="w-1/2 relative">
                              <input type="number" value={spec.cat2} onChange={(e) => handleSpectacleSettingChange(id, 'cat2', e.target.value)} className="w-full bg-[#0E131F] border border-slate-700 rounded px-1.5 py-1 text-white text-[10px] pr-4" />
                              <span className="absolute right-1.5 top-1 text-[9px] text-slate-500">€</span>
                            </div>
                            <div className="w-1/2 relative">
                              <input type="number" value={spec.cat2Seats} onChange={(e) => handleSeatChange(id, 'cat2', e.target.value)} className="w-full bg-[#0E131F] border border-slate-700 rounded px-1.5 py-1 text-white text-[10px] pr-5" />
                              <span className="absolute right-1.5 top-1 text-[9px] text-slate-500">pl.</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Carte Notifications */}
            <div className="bg-[#131927] border border-slate-800/80 rounded-xl p-5 space-y-4">
              <h3 className="text-xs font-semibold text-white">Alertes & Notifications</h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Alerte séance sous le seuil de rentabilité</span>
                  <button
                    onClick={() => setNotifRentability(!notifRentability)}
                    className={`w-9 h-5 flex items-center rounded-full p-1 transition cursor-pointer ${notifRentability ? 'bg-emerald-500 justify-end' : 'bg-slate-700 justify-start'}`}
                  >
                    <div className="bg-white w-3.5 h-3.5 rounded-full shadow-md"></div>
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Rapport hebdomadaire de remplissage</span>
                  <button
                    onClick={() => setNotifWeekly(!notifWeekly)}
                    className={`w-9 h-5 flex items-center rounded-full p-1 transition cursor-pointer ${notifWeekly ? 'bg-emerald-500 justify-end' : 'bg-slate-700 justify-start'}`}
                  >
                    <div className="bg-white w-3.5 h-3.5 rounded-full shadow-md"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* TABLEAU DE BORD COMPLET AVEC SIMULATEUR DYNAMIQUE */
          <>
            {/* Sélecteur de Spectacle */}
            <div className="bg-[#131927] border border-slate-800/80 p-3 rounded-xl flex items-center justify-between">
              <span className="text-slate-400 font-medium">🎭 Filtrer le tableau de bord par spectacle ({venueType}) :</span>
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

            {/* BLOC 1 : SYNTHÈSE GLOBALE DE LA SAISON */}
            <div className="bg-gradient-to-r from-[#131927] to-[#1a2338] border border-emerald-500/30 rounded-xl p-5 space-y-3 shadow-lg">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Synthèse Globale de la Saison (Toutes productions)</h3>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Moyenne pondérée active
                </span>
              </div>

              <div className="grid grid-cols-4 gap-4 pt-1">
                <div className="bg-[#0E131F]/80 border border-slate-800 p-3.5 rounded-lg space-y-1">
                  <span className="text-[9px] text-slate-400 block uppercase font-medium">1. Jauge Globale Saison</span>
                  <div className="text-lg font-bold text-white">{globalData.fillingRate}</div>
                  <p className="text-[9px] text-slate-400">Total vendus : {globalData.soldTicketsText}</p>
                </div>

                <div className="bg-[#0E131F]/80 border border-slate-800 p-3.5 rounded-lg space-y-1">
                  <span className="text-[9px] text-slate-400 block uppercase font-medium">2. RMT Net Global (Moyen)</span>
                  <div className="text-lg font-bold text-white">
                    {globalData.rmsNet} 
                    <span className="text-[10px] font-normal text-slate-400"> / cible {globalData.targetRmtVal} €</span>
                  </div>
                  <p className="text-[9px] text-emerald-400">Moyenne pondérée après commissions</p>
                </div>

                <div className="bg-[#0E131F]/80 border border-slate-800 p-3.5 rounded-lg space-y-1">
                  <span className="text-[9px] text-slate-400 block uppercase font-medium">3. Point d'Équilibre Global</span>
                  <div className={`text-lg font-bold ${globalIsReached ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {globalIsReached ? 'Atteint' : 'En cours'} ({globalData.coverage}% / cible {globalData.targetSr}%)
                  </div>
                  <p className="text-[9px] text-slate-400">Couverture budgétaire de saison</p>
                </div>

                <div className="bg-[#0E131F]/80 border border-slate-800 p-3.5 rounded-lg space-y-1">
                  <span className="text-[9px] text-slate-400 block uppercase font-medium">4. Canaux de Vente (Saison)</span>
                  <div className="text-[10px] font-medium text-slate-200 space-y-0.5 pt-0.5">
                    <div className="flex justify-between"><span>Guichet :</span> <strong className="text-emerald-400">{globalData.networks.guichet}</strong></div>
                    <div className="flex justify-between"><span>BilletReduc :</span> <strong className="text-amber-400">{globalData.networks.billetterieReduc}</strong></div>
                  </div>
                </div>
              </div>
            </div>

            {/* BLOC 2 : SYNTHÈSE DU SPECTACLE SÉLECTIONNÉ */}
            {selectedSpectacleId !== 'all' && currentSpectacleData && (
              <div className="bg-gradient-to-r from-[#131927] to-[#1a2338] border border-cyan-500/30 rounded-xl p-5 space-y-3 shadow-lg">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Vue par Spectacle : {currentSpectacleData.title}</h3>
                  </div>
                  <span className="text-[10px] text-cyan-400 font-semibold bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                    Budget charges : {currentSpectacleData.budget.toLocaleString()} €
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-4 pt-1">
                  <div className="bg-[#0E131F]/80 border border-slate-800 p-3.5 rounded-lg space-y-1">
                    <span className="text-[9px] text-slate-400 block uppercase font-medium">1. Jauge du Spectacle</span>
                    <div className="text-lg font-bold text-white">{currentSpectacleData.fillingRate}</div>
                    <p className="text-[9px] text-slate-400">Vendus : {currentSpectacleData.soldTicketsText}</p>
                  </div>

                  <div className="bg-[#0E131F]/80 border border-slate-800 p-3.5 rounded-lg space-y-1">
                    <span className="text-[9px] text-slate-400 block uppercase font-medium">2. RMT Net Actuel vs Cible</span>
                    <div className="text-lg font-bold text-white">
                      {currentSpectacleData.rmsNet} 
                      <span className="text-[10px] font-normal text-cyan-400"> / cible {currentSpectacleData.targetRmtVal} €</span>
                    </div>
                    <p className="text-[9px] text-cyan-400">Calculé via budget / jauge / obj</p>
                  </div>

                  <div className="bg-[#0E131F]/80 border border-slate-800 p-3.5 rounded-lg space-y-1">
                    <span className="text-[9px] text-slate-400 block uppercase font-medium">3. Point d'Équilibre (Spectacle)</span>
                    <div className={`text-lg font-bold ${specIsReached ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {specIsReached ? 'Atteint' : 'En cours'} ({currentSpectacleData.coverage}% / cible {currentSpectacleData.targetSr}%)
                    </div>
                    <p className="text-[9px] text-slate-400">Couverture des charges</p>
                  </div>

                  <div className="bg-[#0E131F]/80 border border-slate-800 p-3.5 rounded-lg space-y-1">
                    <span className="text-[9px] text-slate-400 block uppercase font-medium">4. Canaux de Vente</span>
                    <div className="text-[10px] font-medium text-slate-200 space-y-0.5 pt-0.5">
                      <div className="flex justify-between"><span>Guichet :</span> <strong className="text-emerald-400">{currentSpectacleData.networks.guichet}</strong></div>
                      <div className="flex justify-between"><span>Partenaires :</span> <strong className="text-amber-400">Actifs</strong></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* BLOC 3 : RECOMMANDATIONS IA DYNAMIQUES */}
            <div className="bg-[#131927] border border-slate-800/80 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-semibold text-white flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Recommandations Intelligentes & Alertes Séances {selectedSpectacleId !== `all` ? `(${spectaclesList.find(s => s.id === Number(selectedSpectacleId))?.title})` : '(Vue Saison)'}
                  </h3>
                  <div className="group relative flex items-center cursor-pointer">
                    <span className="h-4 w-4 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[9px] flex items-center justify-center font-bold hover:bg-emerald-500 hover:text-slate-950 transition">ⓘ</span>
                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block w-56 bg-slate-900 text-slate-200 text-[10px] p-2.5 rounded shadow-xl border border-slate-700 z-20 pointer-events-none">
                      <strong>Valeur ajoutée de l'IA (EventLens) :</strong> L'intelligence artificielle croise en temps réel la vélocité des ventes et vos seuils pour détecter les risques financiers.
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500">{activeRecommendations.length} recommandation(s) active(s)</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {activeRecommendations.map((rec, index) => {
                  const badgeColor = rec.type === 'alert' 
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                    : rec.type === 'opportunity' 
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

                  return (
                    <div key={index} className="bg-[#0E131F] border border-slate-800/80 p-3 rounded-lg space-y-2 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className={`${badgeColor} border text-[9px] px-1.5 py-0.5 rounded font-bold uppercase`}>
                            {rec.badge}
                          </span>
                          <span className="text-[9px] text-slate-500">{rec.date}</span>
                        </div>
                        <p className="text-[10px] text-slate-300">
                          <strong className="text-white">Diagnostic :</strong> {rec.diagnostic}
                        </p>
                        {rec.detail && (
                          <p className="text-[10px] text-rose-400 font-semibold">{rec.detail}</p>
                        )}
                      </div>
                      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                        <span className="text-[9px] text-amber-300 font-medium">{rec.actionText}</span>
                        {rec.actionable && (
                          <button
                            onClick={() => setAppliedYield(!appliedYield)}
                            className={`px-2 py-1 rounded text-[9px] font-semibold transition ${appliedYield ? 'bg-emerald-600 text-white' : 'bg-emerald-500 text-slate-950'}`}
                          >
                            {appliedYield ? '✓ Appliqué' : 'Activer 1-clic'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Catalogue Multi-Spectacles */}
            <div className="bg-[#131927] border border-slate-800/80 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center pb-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-semibold text-white">Catalogue des Représentations & Statut d'Équilibre</h3>
                  <div className="group relative flex items-center cursor-pointer">
                    <span className="h-4 w-4 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[9px] flex items-center justify-center font-bold hover:bg-emerald-500 hover:text-slate-950 transition">ⓘ</span>
                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block w-56 bg-slate-900 text-slate-200 text-[10px] p-2.5 rounded shadow-xl border border-slate-700 z-20 pointer-events-none">
                      <strong>Catalogue :</strong> Vue détaillée par spectacle et par représentation pour auditer la conformité des recettes nettes face aux objectifs.
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">3 spectacles actifs</span>
              </div>

              <div className="space-y-3">
                {spectaclesList.map((spec) => {
                  const isOpen = openSpectacles[spec.id];
                  const specSettingsObj = spectacleSettings[spec.id];
                  const specRmtTarget = calculateTargetRmt(specSettingsObj);

                  return (
                    <div key={spec.id} className="border border-slate-800/80 rounded-lg overflow-hidden bg-[#0E131F]">
                      <button
                        onClick={() => toggleSpectacleAccordion(spec.id)}
                        className="w-full p-3.5 flex justify-between items-center hover:bg-slate-800/40 transition text-left cursor-pointer"
                      >
                        <div>
                          <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-semibold">
                            {spec.category} (CIBLE RMT : {specRmtTarget} €)
                          </span>
                          <h4 className="font-bold text-white text-sm">{spec.title}</h4>
                          <p className="text-[10px] text-slate-400">{spec.dates}</p>
                        </div>
                        <div className="flex items-center gap-8 text-[11px]">
                          <div className="text-right">
                            <span className="text-[9px] text-slate-400 block uppercase">Remplissage global</span>
                            <span className="text-white font-bold">{spec.fillingRate}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] text-slate-400 block uppercase">Billets vendus</span>
                            <span className="text-white font-bold">{spec.soldCount}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] text-slate-400 block uppercase">Places restantes</span>
                            <span className="text-amber-400 font-bold">{spec.remainingTickets}</span>
                          </div>
                          <span className="text-slate-400 text-xs pl-2">{isOpen ? '▲' : '▼'}</span>
                        </div>
                      </button>

                      {isOpen && (
                        <div className="border-t border-slate-800/80 divide-y divide-slate-800/60 text-[10px]">
                          {spec.representations.map((rep) => (
                            <div key={rep.id} className="p-3.5 flex justify-between items-center bg-[#131927]/40">
                              <div>
                                <span className="font-semibold text-white block text-[11px] mb-0.5">{rep.date}</span>
                                <span className="text-slate-300">
                                  Revenu net moyen : <strong>{rep.rmsNet} €</strong> | Objectif RMT requis : <strong>{specRmtTarget} €</strong> | Jauge : <strong>{rep.seats}</strong>
                                </span>
                              </div>
                              <span className={`px-2.5 py-1 rounded text-[9px] font-bold ${
                                rep.alert 
                                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' 
                                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              }`}>
                                {rep.alert ? '⚠ Action requise — Sous l\'objectif RMT' : '✓ Séance équilibrée — Objectif atteint'}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* BLOC 4 : SIMULATEUR D'IMPACT TARIFAIRE DYNAMIQUE */}
            <div className="bg-[#131927] border border-slate-800/80 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xs font-semibold text-white">Simulateur d'Impact Tarifaire ("Mode Et Si ?")</h3>
                  <p className="text-[9px] text-slate-400">Basé sur le périmètre actif : <strong className="text-emerald-400">{activeSimulatorName}</strong> ({activeCatOrSeats} places Carré Or)</p>
                </div>
                <div className="group relative flex items-center cursor-pointer">
                  <span className="h-4 w-4 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[9px] flex items-center justify-center font-bold hover:bg-emerald-500 hover:text-slate-950 transition">ⓘ</span>
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block w-56 bg-slate-900 text-slate-200 text-[10px] p-2.5 rounded shadow-xl border border-slate-700 z-20 pointer-events-none">
                    <strong>Simulateur :</strong> Estimez l'impact financier net d'une hausse tarifaire sur vos carrés VIP du spectacle sélectionné.
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="col-span-2 space-y-3">
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span>Hausse tarifaire sur les places VIP (+{autoYieldPrice} €)</span>
                      <span className="text-emerald-400">+{autoYieldPrice} €</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="15"
                      value={autoYieldPrice}
                      onChange={(e) => setAutoYieldPrice(Number(e.target.value))}
                      className="w-full accent-emerald-400 cursor-pointer"
                    />
                  </div>
                </div>
                <div className="bg-[#0E131F] border border-slate-800 p-3 rounded-lg text-center space-y-1">
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Impact financier net estimé</span>
                  <div className="text-lg font-bold text-emerald-400">+{simulatorImpact.toLocaleString()} €</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
