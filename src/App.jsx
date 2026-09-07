import React, { useState } from 'react';

export default function App() {
  const [activeRole, setActiveRole] = useState('Resp. Billetterie');
  const [activeTab, setActiveTab] = useState('Tableau de bord');
  const [selectedSpectacleId, setSelectedSpectacleId] = useState('all');
  const [openSpectacles, setOpenSpectacles] = useState({ 1: true, 2: false, 3: false });
  const [appliedYield, setAppliedYield] = useState(false);

  // Paramètres globaux (Interface Lovable)
  const [venueType, setVenueType] = useState('Théâtre');
  const [defaultProfile, setDefaultProfile] = useState('Responsable Billetterie');
  const [maxCac, setMaxCac] = useState(5);
  const [alertTan, setAlertTan] = useState(5);
  const [targetRmt, setTargetRmt] = useState(34);

  // Toggles de notifications
  const [notifRentability, setNotifRentability] = useState(true);
  const [notifWeekly, setNotifWeekly] = useState(true);
  const [notifCompetitor, setNotifCompetitor] = useState(false);

  // Paramètres spécifiques œuvre par œuvre (Coût de revient & Objectif d'équilibre)
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
      soldTickets: 1260,
      remainingTickets: 3540,
      kpis: {
        rmsNet: '26.80 €',
        rmsTarget: `${targetRmt}.00 €`,
        rmsComment: '-10% sous la cible',
        coverage: 72,
        cac: `${maxCac}.20 € / billet`,
        cacStatus: 'Frais marketing élevés',
        cancellation: `${alertTan}.1%`
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
      fillingRate: '68%',
      soldTickets: 3100,
      remainingTickets: 1450,
      kpis: {
        rmsNet: '34.50 €',
        rmsTarget: `${targetRmt}.00 €`,
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
      fillingRate: '91%',
      soldTickets: 4550,
      remainingTickets: 450,
      kpis: {
        rmsNet: '41.20 €',
        rmsTarget: `${targetRmt}.00 €`,
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
        rmsTarget: `${targetRmt}.00 €`,
        rmsComment: '+4% au-dessus des prévisions',
        coverage: 82,
        cac: `${maxCac}.80 € / billet`,
        cacStatus: 'Frais marketing sous surveillance',
        cancellation: `${alertTan - 0.1}%`
      }
    : spectaclesList.find(s => s.id === Number(selectedSpectacleId)).kpis;

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
          /* ONGLET PARAMÈTRES UNIFIÉ (LOVABLE + COÛT DE REVIENT & ÉQUILIBRE SPÉCIFIQUE) */
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="text-sm font-semibold text-white">Paramètres</h2>
              <p className="text-[10px] text-slate-400">Réglez les seuils d'alerte et configurez les modèles économiques œuvre par œuvre.</p>
            </div>

            {/* Carte Établissement */}
            <div className="bg-[#131927] border border-slate-800/80 rounded-xl p-5 space-y-4">
              <h3 className="text-xs font-semibold text-white">Établissement</h3>

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
                  <label className="text-[11px] text-slate-300 font-medium block">Profil métier par défaut</label>
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

            {/* Carte Seuils d'alerte */}
            <div className="bg-[#131927] border border-slate-800/80 rounded-xl p-5 space-y-4">
              <h3 className="text-xs font-semibold text-white">Seuils d'alerte globaux</h3>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-300 font-medium block">CAC maximum (€)</label>
                  <input
                    type="number"
                    value={maxCac}
                    onChange={(e) => setMaxCac(Number(e.target.value))}
                    className="w-full bg-[#0E131F] border border-slate-700 rounded px-3 py-2 text-white text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-300 font-medium block">TAN d'alerte (%)</label>
                  <input
                    type="number"
                    value={alertTan}
                    onChange={(e) => setAlertTan(Number(e.target.value))}
                    className="w-full bg-[#0E131F] border border-slate-700 rounded px-3 py-2 text-white text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-300 font-medium block">RMT cible (€)</label>
                  <input
                    type="number"
                    value={targetRmt}
                    onChange={(e) => setTargetRmt(Number(e.target.value))}
                    className="w-full bg-[#0E131F] border border-slate-700 rounded px-3 py-2 text-white text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Carte Modèles Économiques Œuvre par Œuvre */}
            <div className="bg-[#131927] border border-slate-800/80 rounded-xl p-5 space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-white">Spécificités Économiques Œuvre par Œuvre</h3>
                <p className="text-[10px] text-slate-400">Configurez le coût de revient unitaire et l'objectif d'équilibre spécifique de chaque production.</p>
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
              <h3 className="text-xs font-semibold text-white">Notifications</h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Alerte vente sous le seuil de rentabilité</span>
                  <button
                    onClick={() => setNotifRentability(!notifRentability)}
                    className={`w-9 h-5 flex items-center rounded-full p-1 transition cursor-pointer ${notifRentability ? 'bg-emerald-500 justify-end' : 'bg-slate-700 justify-start'}`}
                  >
                    <div className="bg-white w-3.5 h-3.5 rounded-full shadow-md"></div>
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Rapport hebdomadaire d'audit</span>
                  <button
                    onClick={() => setNotifWeekly(!notifWeekly)}
                    className={`w-9 h-5 flex items-center rounded-full p-1 transition cursor-pointer ${notifWeekly ? 'bg-emerald-500 justify-end' : 'bg-slate-700 justify-start'}`}
                  >
                    <div className="bg-white w-3.5 h-3.5 rounded-full shadow-md"></div>
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Veille concurrentielle quotidienne</span>
                  <button
                    onClick={() => setNotifCompetitor(!notifCompetitor)}
                    className={`w-9 h-5 flex items-center rounded-full p-1 transition cursor-pointer ${notifCompetitor ? 'bg-emerald-500 justify-end' : 'bg-slate-700 justify-start'}`}
                  >
                    <div className="bg-white w-3.5 h-3.5 rounded-full shadow-md"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* TABLEAU DE BORD */
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

            {/* 4 cartes KPIs dynamiques */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-[#131927] border border-slate-800/80 p-4 rounded-xl space-y-2">
                <span className="text-[10px] text-slate-400 font-medium">Revenu Net Moyen / Billet (RMT)</span>
                <div className="text-xl font-bold text-white">{currentData.rmsNet} <span className="text-[10px] font-normal text-slate-500">/ cible {targetRmt}.00 €</span></div>
                <p className="text-[9px] text-emerald-400">{currentData.rmsComment}</p>
              </div>

              <div className="bg-[#131927] border border-slate-800/80 p-4 rounded-xl space-y-2">
                <span className="text-[10px] text-slate-400 font-medium">Point d'Équilibre (Rentabilité)</span>
                <div className={`text-xl font-bold ${isSREffectivelyReached ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {isSREffectivelyReached ? 'Atteint' : 'En cours'} ({currentData.coverage}% / cible {activeSrPercentage}%)
                </div>
                <p className="text-[9px] text-slate-500">Profil : {defaultProfile}</p>
              </div>

              <div className="bg-[#131927] border border-slate-800/80 p-4 rounded-xl space-y-2">
                <span className="text-[10px] text-slate-400 font-medium">Coût d'Acquisition (CAC max : {maxCac} €)</span>
                <div className="text-xl font-bold text-amber-400">{currentData.cac}</div>
                <p className="text-[9px] text-amber-500/80">{currentData.cacStatus}</p>
              </div>

              <div className="bg-[#131927] border border-slate-800/80 p-4 rounded-xl space-y-2">
                <span className="text-[10px] text-slate-400 font-medium">Taux d'Annulation (TAN max : {alertTan}%)</span>
                <div className="text-xl font-bold text-white">{currentData.cancellation}</div>
                <p className="text-[9px] text-emerald-400">Niveau optimal</p>
              </div>
            </div>

            {/* Catalogue Multi-Spectacles */}
            <div className="bg-[#131927] border border-slate-800/80 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-semibold text-white">Catalogue des Représentations & Statut d'Équilibre</h3>
              <div className="space-y-3">
                {spectaclesList.map((spec) => {
                  const isOpen = openSpectacles[spec.id];
                  const specTarget = spectacleSettings[spec.id].srTarget;
                  return (
                    <div key={spec.id} className="border border-slate-800/80 rounded-lg overflow-hidden bg-[#0E131F]">
                      <button
                        onClick={() => toggleSpectacleAccordion(spec.id)}
                        className="w-full p-3 flex justify-between items-center hover:bg-slate-800/40 transition text-left cursor-pointer"
                      >
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase tracking-wider block">{spec.category} — Objectif équilibre : {specTarget}%</span>
                          <h4 className="font-semibold text-white text-sm">{spec.title}</h4>
                          <p className="text-[10px] text-slate-500">{spec.dates}</p>
                        </div>
                        <div className="flex items-center gap-6 text-[10px]">
                          <span className="text-white font-bold text-xs">{spec.fillingRate} rempli</span>
                          <span className="text-slate-500 text-xs">{isOpen ? '▲' : '▼'}</span>
                        </div>
                      </button>

                      {isOpen && (
                        <div className="border-t border-slate-800/80 divide-y divide-slate-800/60 text-[10px]">
                          {spec.representations.map((rep) => (
                            <div key={rep.id} className="p-3 flex justify-between items-center bg-[#131927]/40">
                              <div>
                                <span className="font-medium text-white block">{rep.date}</span>
                                <span className="text-slate-400">Revenu net moyen : <strong>{rep.rmsNet} €</strong> | Cible RMT : <strong>{targetRmt} €</strong></span>
                              </div>
                              <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                ✓ Séance conforme
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
          </>
        )}
      </div>
    </div>
  );
}
