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
  const [targetRmt, setTargetRmt] = useState(30);

  // Toggles de notifications
  const [notifRentability, setNotifRentability] = useState(true);
  const [notifWeekly, setNotifWeekly] = useState(true);

  // Modèles économiques œuvre par œuvre
  const [spectacleSettings, setSpectacleSettings] = useState({
    1: { title: 'Le Misanthrope', baseCost: 38.0, srTarget: 85 },
    2: { title: 'Le Dîner de Cons', baseCost: 32.0, srTarget: 75 },
    3: { title: 'Fary — Aime', baseCost: 30.0, srTarget: 70 }
  });

  const handleSpectacleSettingChange = (id, field, value) => {
    setSpectacleSettings(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: Number(value) }
    }));
  };

  // Catalogue complet des spectacles
  const spectaclesList = [
    {
      id: 1,
      category: 'Théâtre classique',
      title: 'Le Misanthrope',
      dates: '12 sept. — 04 oct. 2026',
      fillingRate: '26%',
      soldTickets: '1 260',
      remainingTickets: '3 540',
      networks: { guichet: '45%', billetterieReduc: '35%', fnacReseau: '20%' },
      kpis: {
        rmsNet: '26.80 €',
        coverage: 72,
        status: 'Attention : Jauge lente'
      },
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
      soldTickets: '3 100',
      remainingTickets: '1 450',
      networks: { guichet: '60%', billetterieReduc: '25%', fnacReseau: '15%' },
      kpis: {
        rmsNet: '34.50 €',
        coverage: 88,
        status: 'Dynamique excellente'
      },
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
      soldTickets: '4 550',
      remainingTickets: '450',
      networks: { guichet: '80%', billetterieReduc: '10%', fnacReseau: '10%' },
      kpis: {
        rmsNet: '41.20 €',
        coverage: 114,
        status: 'Quasi-complet'
      },
      representations: [
        { id: 301, date: 'Jeu. 05 Nov. — 20h00', rmsNet: 42.0, seats: '490/500 places vendues', alert: false },
        { id: 302, date: 'Ven. 06 Nov. — 20h00', rmsNet: 44.5, seats: '500/500 places vendues (Complet)', alert: false }
      ]
    }
  ];

  // Données KPIs dynamiques selon la sélection
  const currentData = selectedSpectacleId === 'all' 
    ? {
        title: 'Vue Globale (Toute la Saison)',
        fillingRate: '62%',
        soldTickets: '8 910 / 14 550 pl.',
        rmsNet: '31.20 €',
        coverage: 82,
        status: 'Saison équilibrée',
        networks: { guichet: '62%', billetterieReduc: '23%', fnacReseau: '15%' }
      }
    : {
        ...spectaclesList.find(s => s.id === Number(selectedSpectacleId)),
        soldTickets: `${spectaclesList.find(s => s.id === Number(selectedSpectacleId)).soldTickets} / ${spectaclesList.find(s => s.id === Number(selectedSpectacleId)).remainingTickets} pl.`
      };

  const activeSrPercentage = selectedSpectacleId === 'all' 
    ? 80 
    : spectacleSettings[selectedSpectacleId].srTarget;

  const isSREffectivelyReached = currentData.coverage >= activeSrPercentage;

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
              <p className="text-[10px] text-slate-400">Configurez votre établissement et les modèles économiques de vos spectacles.</p>
            </div>

            {/* Carte Établissement */}
            <div className="bg-[#131927] border border-slate-800/80 rounded-xl p-5 space-y-4">
              <h3 className="text-xs font-semibold text-white">Établissement & Objectif Principal</h3>

              <div className="grid grid-cols-3 gap-4">
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

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-300 font-medium block">RMT Cible (€ / billet)</label>
                  <input
                    type="number"
                    value={targetRmt}
                    onChange={(e) => setTargetRmt(Number(e.target.value))}
                    className="w-full bg-[#0E131F] border border-slate-700 rounded px-3 py-2 text-white text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Carte Modèles Économiques */}
            <div className="bg-[#131927] border border-slate-800/80 rounded-xl p-5 space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-white">Modèles Économiques par Spectacle</h3>
                <p className="text-[10px] text-slate-400">Ajustez le coût de revient unitaire et le taux de couverture requis pour chaque production.</p>
              </div>

              <div className="space-y-3 pt-1">
                {Object.keys(spectacleSettings).map((id) => {
                  const spec = spectacleSettings[id];
                  const netTarget = Math.round((spec.baseCost * (spec.srTarget / 100)) * 10) / 10;

                  return (
                    <div key={id} className="bg-[#0E131F] border border-slate-800 p-3.5 rounded-lg space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-white text-xs">{spec.title}</h4>
                        <span className="text-[9px] text-emerald-400 font-medium">Prix net cible : ~{netTarget} €</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 block">Coût de revient unitaire (€) :</label>
                          <input
                            type="number"
                            value={spec.baseCost}
                            onChange={(e) => handleSpectacleSettingChange(id, 'baseCost', e.target.value)}
                            className="w-full bg-[#131927] border border-slate-700 rounded px-2.5 py-1.5 text-white text-xs"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 block">Objectif d'Équilibre spécifique (%) :</label>
                          <input
                            type="number"
                            value={spec.srTarget}
                            onChange={(e) => handleSpectacleSettingChange(id, 'srTarget', e.target.value)}
                            className="w-full bg-[#131927] border border-slate-700 rounded px-2.5 py-1.5 text-white text-xs"
                          />
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
          /* TABLEAU DE BORD COMPLET */
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

            {/* 4 cartes KPIs avec Infobulles ⓘ */}
            <div className="grid grid-cols-4 gap-4">
              {/* 1. Jauge */}
              <div className="bg-[#131927] border border-slate-800/80 p-4 rounded-xl space-y-2 relative">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 font-medium">1. Jauge (Taux de Remplissage)</span>
                  <div className="group relative flex items-center cursor-pointer">
                    <span className="h-4 w-4 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[9px] flex items-center justify-center font-bold hover:bg-emerald-500 hover:text-slate-950 transition">ⓘ</span>
                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block w-56 bg-slate-900 text-slate-200 text-[10px] p-2.5 rounded shadow-xl border border-slate-700 z-20 pointer-events-none">
                      <strong>Taux de Jauge :</strong> Pourcentage de places vendues par rapport à la capacité totale de la salle.
                    </div>
                  </div>
                </div>
                <div className="text-xl font-bold text-white">{currentData.fillingRate}</div>
                <p className="text-[9px] text-slate-400">Billets vendus : {currentData.soldTickets}</p>
              </div>

              {/* 2. Recette Nette par place */}
              <div className="bg-[#131927] border border-slate-800/80 p-4 rounded-xl space-y-2 relative">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 font-medium">2. Recette Nette / Place (RMT)</span>
                  <div className="group relative flex items-center cursor-pointer">
                    <span className="h-4 w-4 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[9px] flex items-center justify-center font-bold hover:bg-emerald-500 hover:text-slate-950 transition">ⓘ</span>
                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block w-56 bg-slate-900 text-slate-200 text-[10px] p-2.5 rounded shadow-xl border border-slate-700 z-20 pointer-events-none">
                      <strong>RMT Net :</strong> Revenu moyen réel encaissé par billet après déduction des commissions des réseaux.
                    </div>
                  </div>
                </div>
                <div className="text-xl font-bold text-white">
                  {selectedSpectacleId === 'all' ? currentData.rmsNet : currentData.kpis.rmsNet} 
                  <span className="text-[10px] font-normal text-slate-500"> / cible {targetRmt} €</span>
                </div>
                <p className="text-[9px] text-emerald-400">Revenu réel après commissions</p>
              </div>

              {/* 3. Point d'Équilibre (Rentabilité) */}
              <div className="bg-[#131927] border border-slate-800/80 p-4 rounded-xl space-y-2 relative">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 font-medium">3. Point d'Équilibre (Rentabilité)</span>
                  <div className="group relative flex items-center cursor-pointer">
                    <span className="h-4 w-4 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[9px] flex items-center justify-center font-bold hover:bg-emerald-500 hover:text-slate-950 transition">ⓘ</span>
                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block w-56 bg-slate-900 text-slate-200 text-[10px] p-2.5 rounded shadow-xl border border-slate-700 z-20 pointer-events-none">
                      <strong>Point d'Équilibre :</strong> Indique si la billetterie couvre les charges fixes de la production selon l'objectif configuré.
                    </div>
                  </div>
                </div>
                <div className={`text-xl font-bold ${isSREffectivelyReached ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {isSREffectivelyReached ? 'Atteint' : 'En cours'} ({currentData.coverage}% / cible {activeSrPercentage}%)
                </div>
                <p className="text-[9px] text-slate-500">Couverture des coûts fixes</p>
              </div>

              {/* 4. Réseaux de vente */}
              <div className="bg-[#131927] border border-slate-800/80 p-4 rounded-xl space-y-2 relative">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 font-medium">4. Canaux de Vente Principaux</span>
                  <div className="group relative flex items-center cursor-pointer">
                    <span className="h-4 w-4 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[9px] flex items-center justify-center font-bold hover:bg-emerald-500 hover:text-slate-950 transition">ⓘ</span>
                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block w-56 bg-slate-900 text-slate-200 text-[10px] p-2.5 rounded shadow-xl border border-slate-700 z-20 pointer-events-none">
                      <strong>Canaux de Vente :</strong> Répartition des ventes entre la billetterie directe et les réseaux partenaires.
                    </div>
                  </div>
                </div>
                <div className="text-xs font-semibold text-slate-200 space-y-0.5 pt-1">
                  <div className="flex justify-between"><span>Guichet direct :</span> <strong className="text-emerald-400">{currentData.networks.guichet}</strong></div>
                  <div className="flex justify-between"><span>BilletReduc :</span> <strong className="text-amber-400">{currentData.networks.billetterieReduc}</strong></div>
                  <div className="flex justify-between"><span>Réseau Fnac :</span> <strong className="text-slate-300">{currentData.networks.fnacReseau}</strong></div>
                </div>
              </div>
            </div>

            {/* Bloc Insights & Recommandations IA */}
            <div className="bg-[#131927] border border-slate-800/80 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-semibold text-white flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Recommandations Intelligentes & Alertes Séances (Insights IA)
                  </h3>
                </div>
                <span className="text-[10px] text-slate-500">Moteur actif en temps réel</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#0E131F] border border-slate-800/80 p-3 rounded-lg space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase block w-max">
                      ALERTE : JAUGE LENTE
                    </span>
                    <p className="text-[10px] text-slate-300">
                      <strong className="text-white">Diagnostic :</strong> Retard de vente constaté sur Le Misanthrope à J-5.
                    </p>
                    <p className="text-[10px] text-rose-400 font-semibold">Manque à gagner estimé : -1 850 €</p>
                  </div>
                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                    <span className="text-[9px] text-amber-300 font-medium">👉 Action : Relais BilletReduc</span>
                    <button
                      onClick={() => setAppliedYield(!appliedYield)}
                      className={`px-2 py-1 rounded text-[9px] font-semibold transition ${appliedYield ? 'bg-emerald-600 text-white' : 'bg-emerald-500 text-slate-950'}`}
                    >
                      {appliedYield ? '✓ Appliqué' : 'Activer 1-clic'}
                    </button>
                  </div>
                </div>

                <div className="bg-[#0E131F] border border-slate-800/80 p-3 rounded-lg space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase block w-max">
                      OPPORTUNITÉ TARIFAIRE
                    </span>
                    <p className="text-[10px] text-slate-300">
                      <strong className="text-white">Diagnostic :</strong> Forte demande sur Le Dîner de Cons. Carré Or saturé à 90%.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-800/60">
                    <p className="text-[9px] text-emerald-400 font-medium">👉 Action : Activer le yield sur les 10 dernières places.</p>
                  </div>
                </div>

                <div className="bg-[#0E131F] border border-slate-800/80 p-3 rounded-lg space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase block w-max">
                      SÉANCE SÉCURISÉE
                    </span>
                    <p className="text-[10px] text-slate-300">
                      <strong className="text-white">Diagnostic :</strong> Fary — Aime a atteint son point d'équilibre à 114%.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-800/60">
                    <p className="text-[9px] text-slate-300 font-medium">👉 Action : Fermer les réseaux tiers (0% comm.).</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Catalogue Multi-Spectacles au format exact de la maquette */}
            <div className="bg-[#131927] border border-slate-800/80 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center pb-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-semibold text-white">Catalogue des Représentations & Statut d'Équilibre</h3>
                  <span className="h-4 w-4 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[9px] flex items-center justify-center font-bold cursor-pointer">ⓘ</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">3 spectacles actifs</span>
              </div>

              <div className="space-y-3">
                {spectaclesList.map((spec) => {
                  const isOpen = openSpectacles[spec.id];
                  const specTarget = spectacleSettings[spec.id].srTarget;
                  return (
                    <div key={spec.id} className="border border-slate-800/80 rounded-lg overflow-hidden bg-[#0E131F]">
                      <button
                        onClick={() => toggleSpectacleAccordion(spec.id)}
                        className="w-full p-3.5 flex justify-between items-center hover:bg-slate-800/40 transition text-left cursor-pointer"
                      >
                        <div>
                          <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-semibold">
                            {spec.category} (CIBLE ÉQUILIBRE : {specTarget}%)
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
                            <span className="text-white font-bold">{spec.soldTickets}</span>
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
                                  Revenu net moyen : <strong>{rep.rmsNet} €</strong> | Objectif équilibre requis : <strong>{targetRmt} €</strong> | Jauge : <strong>{rep.seats}</strong>
                                </span>
                              </div>
                              <span className={`px-2.5 py-1 rounded text-[9px] font-bold ${
                                rep.alert 
                                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' 
                                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              }`}>
                                {rep.alert ? '⚠ Action requise — Sous l\'objectif d\'équilibre' : '✓ Séance équilibrée — Objectif atteint'}
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

            {/* Simulateur de Yield ("Mode Et Si ?") */}
            <div className="bg-[#131927] border border-slate-800/80 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-semibold text-white">Simulateur d'Impact Tarifaire ("Mode Et Si ?")</h3>
                <div className="group relative flex items-center cursor-pointer">
                  <span className="h-4 w-4 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[9px] flex items-center justify-center font-bold hover:bg-emerald-500 hover:text-slate-950 transition">ⓘ</span>
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block w-56 bg-slate-900 text-slate-200 text-[10px] p-2.5 rounded shadow-xl border border-slate-700 z-20 pointer-events-none">
                    <strong>Simulateur :</strong> Estimez l'impact financier net d'une modification tarifaire sur vos carrés VIP.
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
                  <div className="text-lg font-bold text-emerald-400">+{autoYieldPrice * 955} €</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
