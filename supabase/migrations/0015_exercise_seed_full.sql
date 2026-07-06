-- Seed complet : exercices supplémentaires
insert into public.exercises (name, primary_muscle, secondary_muscles, movement_type, equipment, level, instructions, is_unilateral) values

-- POITRINE
('Câble croisé bas', 'chest', array['shoulders']::muscle_group[], 'isolation', array['cable machine'], 'beginner', 'Poulies en position basse, croiser les mains vers le haut en arc de cercle.', false),
('Câble croisé haut', 'chest', array['shoulders']::muscle_group[], 'isolation', array['cable machine'], 'beginner', 'Poulies en position haute, croiser les mains vers le bas.', false),
('Pec deck (butterfly)', 'chest', array[]::muscle_group[], 'isolation', array['pec deck machine'], 'beginner', 'Assis, fermer les bras en arc de cercle devant la poitrine.', false),
('Développé décliné barre', 'chest', array['triceps']::muscle_group[], 'compound', array['barbell','decline bench'], 'intermediate', 'Banc décliné, cible le bas de la poitrine.', false),
('Développé décliné haltères', 'chest', array['triceps']::muscle_group[], 'compound', array['dumbbells','decline bench'], 'intermediate', 'Même mouvement que barre mais haltères, banc décliné.', false),
('Pompes decline', 'chest', array['triceps','shoulders']::muscle_group[], 'bodyweight', array['bench'], 'beginner', 'Pieds surélevés sur un banc, pompes inclinées vers le bas.', false),
('Pompes diamant', 'chest', array['triceps']::muscle_group[], 'bodyweight', array[]::text[], 'intermediate', 'Mains formant un diamant sous la poitrine, ciblant triceps et pec intérieur.', false),
('Dips lestés pectoraux', 'chest', array['triceps','shoulders']::muscle_group[], 'compound', array['dip bars','weight belt'], 'advanced', 'Corps incliné vers l''avant pour cibler les pectoraux, lest ajouté.', false),
('Push-up sur anneaux', 'chest', array['triceps','core']::muscle_group[], 'bodyweight', array['gymnastics rings'], 'advanced', 'Pompes sur anneaux, instabilité maximise l''activation musculaire.', false),
('Svend press', 'chest', array[]::muscle_group[], 'isolation', array['weight plates'], 'beginner', 'Presser deux disques ensemble devant la poitrine, étendre les bras.', false),
('Pullover haltère', 'chest', array['back']::muscle_group[], 'compound', array['dumbbells','bench'], 'intermediate', 'Allongé, haltère tenu à deux mains, descendre derrière la tête et remonter.', false),
('Machine développé couché', 'chest', array['triceps','shoulders']::muscle_group[], 'compound', array['chest press machine'], 'beginner', 'Machine guidée simulant le développé couché, idéale pour les débutants.', false),

-- DOS
('Tirage poitrine prise serrée', 'back', array['biceps']::muscle_group[], 'compound', array['cable machine'], 'beginner', 'Barre étroite à la poulie haute, tirer vers la clavicule.', false),
('Tirage unilatéral poulie', 'back', array['biceps']::muscle_group[], 'compound', array['cable machine'], 'beginner', 'Un bras à la fois à la poulie, rotation du buste en fin de mouvement.', true),
('Rowing Pendlay', 'back', array['biceps','core']::muscle_group[], 'compound', array['barbell'], 'advanced', 'Tronc horizontal au sol, barre posée entre chaque rep, explosif.', false),
('Rowing T-bar', 'back', array['biceps']::muscle_group[], 'compound', array['t-bar machine'], 'intermediate', 'Barre fixée d''un côté, tirer les disques vers la poitrine.', false),
('Rowing machine assise', 'back', array['biceps']::muscle_group[], 'compound', array['rowing machine'], 'beginner', 'Assis sur la machine, tirer les poignées vers l''abdomen.', false),
('Superman', 'back', array['glutes']::muscle_group[], 'bodyweight', array[]::text[], 'beginner', 'Allongé sur le ventre, lever simultanément bras et jambes.', false),
('Good morning', 'back', array['hamstrings','glutes']::muscle_group[], 'compound', array['barbell'], 'intermediate', 'Barre sur les trapèzes, incliner le buste vers l''avant jambes quasi-tendues.', false),
('Extension lombaire machine', 'back', array[]::muscle_group[], 'isolation', array['back extension machine'], 'beginner', 'Assis sur la machine, étendre le dos contre la résistance.', false),
('Extension lombaire banc 45°', 'back', array['glutes','hamstrings']::muscle_group[], 'bodyweight', array['hyperextension bench'], 'beginner', 'Banc à 45°, descendre le buste et remonter jusqu''à l''alignement.', false),
('Tractions neutres', 'back', array['biceps']::muscle_group[], 'compound', array['neutral grip bar'], 'intermediate', 'Prise neutre (paumes face à face), tirer jusqu''au menton.', false),
('Tractions lestées', 'back', array['biceps']::muscle_group[], 'compound', array['pull-up bar','weight belt'], 'advanced', 'Tractions classiques avec lest supplémentaire.', false),
('Muscle-up', 'back', array['chest','triceps']::muscle_group[], 'bodyweight', array['pull-up bar'], 'elite', 'Tractions explosives avec passage en dips au-dessus de la barre.', false),
('Tirage buste horizontal', 'back', array['biceps']::muscle_group[], 'bodyweight', array['pull-up bar'], 'beginner', 'Suspendu sous une barre basse, tirer la poitrine vers la barre.', false),

-- ÉPAULES
('Arnold press', 'shoulders', array['triceps']::muscle_group[], 'compound', array['dumbbells'], 'intermediate', 'Haltères paume vers soi au départ, rotation en poussant au-dessus.', false),
('Élévations frontales', 'shoulders', array[]::muscle_group[], 'isolation', array['dumbbells'], 'beginner', 'Lever les bras devant soi jusqu''à l''horizontale.', false),
('Élévations frontales barre', 'shoulders', array[]::muscle_group[], 'isolation', array['barbell'], 'beginner', 'Lever la barre devant soi, prise en pronation.', false),
('Oiseau / Élévations arrière', 'shoulders', array['back']::muscle_group[], 'isolation', array['dumbbells'], 'beginner', 'Tronc incliné à 90°, lever les bras sur les côtés.', false),
('Tirage à la barre menton', 'shoulders', array['biceps','back']::muscle_group[], 'compound', array['barbell'], 'intermediate', 'Prise serrée, tirer la barre jusqu''au menton en gardant les coudes hauts.', false),
('Tirage menton câble', 'shoulders', array['biceps']::muscle_group[], 'compound', array['cable machine'], 'beginner', 'Même mouvement qu''avec la barre mais à la poulie basse.', false),
('Machine élévations latérales', 'shoulders', array[]::muscle_group[], 'isolation', array['lateral raise machine'], 'beginner', 'Assis sur la machine, lever les bras contre la résistance.', false),
('Pike push-up', 'shoulders', array['triceps']::muscle_group[], 'bodyweight', array[]::text[], 'beginner', 'Position en V inversé, fléchir les bras pour amener la tête au sol.', false),
('Handstand push-up', 'shoulders', array['triceps']::muscle_group[], 'bodyweight', array[]::text[], 'elite', 'En équilibre contre un mur, flexion-extension des bras.', false),
('Cable lateral raise', 'shoulders', array[]::muscle_group[], 'isolation', array['cable machine'], 'beginner', 'Poulie basse, lever le bras sur le côté jusqu''à l''horizontale.', true),

-- BICEPS
('Curl incliné haltères', 'biceps', array[]::muscle_group[], 'isolation', array['dumbbells','incline bench'], 'intermediate', 'Assis sur banc incliné, les bras pendants, curl strict.', true),
('Curl concentré', 'biceps', array[]::muscle_group[], 'isolation', array['dumbbells'], 'beginner', 'Coude posé sur la cuisse, curl lent et concentré.', true),
('Curl câble bas', 'biceps', array[]::muscle_group[], 'isolation', array['cable machine'], 'beginner', 'Poulie basse, curl avec tension constante.', true),
('Curl poulie haute', 'biceps', array[]::muscle_group[], 'isolation', array['cable machine'], 'intermediate', 'Debout face à la poulie haute, fléchir l''avant-bras vers la tête.', true),
('Curl barre EZ', 'biceps', array[]::muscle_group[], 'isolation', array['ez bar'], 'beginner', 'Prise pronation/semi-supination sur barre EZ, moins de stress aux poignets.', false),
('Curl barre EZ incliné', 'biceps', array[]::muscle_group[], 'isolation', array['ez bar','preacher bench'], 'beginner', 'Barre EZ sur pupitre, isolation maximale du biceps.', false),
('Spider curl', 'biceps', array[]::muscle_group[], 'isolation', array['dumbbells','incline bench'], 'intermediate', 'Torse contre le côté incliné d''un banc, curl strict.', false),
('Chin-up (traction supination)', 'biceps', array['back']::muscle_group[], 'compound', array['pull-up bar'], 'intermediate', 'Prise étroite supination, ciblage maximum des biceps.', false),

-- TRICEPS
('Skull crusher barre', 'triceps', array[]::muscle_group[], 'isolation', array['barbell','bench'], 'intermediate', 'Allongé, barre descend vers le front en gardant les coudes fixes.', false),
('Skull crusher haltères', 'triceps', array[]::muscle_group[], 'isolation', array['dumbbells','bench'], 'beginner', 'Même mouvement avec haltères, meilleure amplitude.', false),
('Extension triceps haltère', 'triceps', array[]::muscle_group[], 'isolation', array['dumbbells'], 'beginner', 'Debout ou assis, haltère tenu à deux mains derrière la tête.', false),
('Extension triceps câble unilatéral', 'triceps', array[]::muscle_group[], 'isolation', array['cable machine'], 'beginner', 'Un bras, corde ou poignée, extension vers le bas.', true),
('Overhead tricep câble', 'triceps', array[]::muscle_group[], 'isolation', array['cable machine'], 'beginner', 'Face à la poulie haute, corde, extension des bras au-dessus de la tête.', false),
('Dips banc', 'triceps', array['shoulders']::muscle_group[], 'bodyweight', array['bench'], 'beginner', 'Mains sur le bord d''un banc, descendre et remonter.', false),
('Kickback triceps', 'triceps', array[]::muscle_group[], 'isolation', array['dumbbells'], 'beginner', 'Tronc incliné, coude fixe en arrière, étendre l''avant-bras.', true),

-- QUADRICEPS
('Squat avant (front squat)', 'quadriceps', array['core','glutes']::muscle_group[], 'compound', array['barbell'], 'advanced', 'Barre en position frontale sur les épaules, squat très droit.', false),
('Squat bulgare', 'quadriceps', array['glutes','hamstrings']::muscle_group[], 'compound', array['dumbbells','bench'], 'intermediate', 'Pied arrière surélevé sur un banc, squat sur la jambe avant.', true),
('Fentes marchées', 'quadriceps', array['glutes','hamstrings']::muscle_group[], 'compound', array['dumbbells'], 'beginner', 'Série de fentes en avançant.', false),
('Fentes arrière', 'quadriceps', array['glutes']::muscle_group[], 'compound', array['dumbbells'], 'beginner', 'Grand pas en arrière, genou arrière proche du sol.', true),
('Squat sumo', 'quadriceps', array['glutes','hamstrings']::muscle_group[], 'compound', array['barbell'], 'beginner', 'Pieds très écartés, orteils tournés vers l''extérieur.', false),
('Hack squat', 'quadriceps', array['glutes']::muscle_group[], 'compound', array['hack squat machine'], 'intermediate', 'Machine guidée, dos appuyé sur le dossier incliné.', false),
('Sissy squat', 'quadriceps', array[]::muscle_group[], 'isolation', array[]::text[], 'advanced', 'Talons surélevés, s''incliner en arrière en fléchissant les genoux.', false),
('Presse à jambes une jambe', 'quadriceps', array['glutes']::muscle_group[], 'compound', array['leg press machine'], 'intermediate', 'Une seule jambe sur la plateforme, presse unilatérale.', true),
('Step-up', 'quadriceps', array['glutes','hamstrings']::muscle_group[], 'compound', array['dumbbells','box'], 'beginner', 'Monter sur une box ou un banc, alterner les jambes.', true),
('Wall sit', 'quadriceps', array[]::muscle_group[], 'bodyweight', array[]::text[], 'beginner', 'Dos contre le mur, cuisses parallèles au sol, tenir la position.', false),

-- ISCHIO-JAMBIERS & FESSIERS
('Soulevé de terre sumo', 'hamstrings', array['glutes','back']::muscle_group[], 'compound', array['barbell'], 'intermediate', 'Pieds écartés, prise étroite, dos droit, tirer la barre.', false),
('Soulevé de terre jambe tendue haltères', 'hamstrings', array['glutes','back']::muscle_group[], 'compound', array['dumbbells'], 'beginner', 'Haltères le long des jambes quasi-tendues, flexion de hanche.', false),
('Leg curl assis', 'hamstrings', array[]::muscle_group[], 'isolation', array['seated leg curl machine'], 'beginner', 'Machine assise, fléchir les jambes contre la résistance.', false),
('Nordic curl', 'hamstrings', array[]::muscle_group[], 'bodyweight', array['partner or bar'], 'advanced', 'Chevilles tenues, descendre lentement vers le sol avec les ischio.', false),
('Good girl machine (abducteur)', 'glutes', array[]::muscle_group[], 'isolation', array['abductor machine'], 'beginner', 'Assis, écarter les jambes contre la résistance.', false),
('Bad girl machine (adducteur)', 'glutes', array[]::muscle_group[], 'isolation', array['adductor machine'], 'beginner', 'Assis, fermer les jambes contre la résistance.', false),
('Donkey kick', 'glutes', array[]::muscle_group[], 'bodyweight', array[]::text[], 'beginner', 'À 4 pattes, lever une jambe fléchie vers le plafond.', true),
('Fire hydrant', 'glutes', array[]::muscle_group[], 'bodyweight', array[]::text[], 'beginner', 'À 4 pattes, lever la jambe sur le côté comme un chien.', true),
('Frog pump', 'glutes', array[]::muscle_group[], 'bodyweight', array[]::text[], 'beginner', 'Allongé sur le dos, plantes des pieds ensemble, pousser les hanches.', false),
('Hip thrust unilatéral', 'glutes', array['hamstrings']::muscle_group[], 'compound', array['bench'], 'intermediate', 'Une jambe, pousser les hanches avec une seule jambe active.', true),
('Cable pull-through', 'glutes', array['hamstrings','back']::muscle_group[], 'compound', array['cable machine'], 'beginner', 'Corde entre les jambes à la poulie basse, poussée de hanche en avant.', false),
('Squat goblet sumo', 'glutes', array['quadriceps']::muscle_group[], 'compound', array['dumbbells'], 'beginner', 'Pieds très écartés, haltère contre la poitrine, squat profond.', false),

-- MOLLETS
('Élévation des talons assis', 'calves', array[]::muscle_group[], 'isolation', array['seated calf raise machine'], 'beginner', 'Assis, talon en bas, monter sur la pointe des pieds.', false),
('Élévation des talons unilatérale', 'calves', array[]::muscle_group[], 'isolation', array['dumbbells'], 'beginner', 'Sur une jambe, haltère dans une main, montée de talon.', true),
('Saut à la corde double', 'calves', array['cardio']::muscle_group[], 'cardio', array['jump rope'], 'advanced', 'La corde passe deux fois sous les pieds à chaque saut.', false),

-- ABDOMINAUX & CORE
('Crunch à la poulie', 'abs', array[]::muscle_group[], 'isolation', array['cable machine'], 'beginner', 'À genoux face à la poulie haute, fléchir le buste vers les cuisses.', false),
('Russian twist', 'abs', array['core']::muscle_group[], 'bodyweight', array[]::text[], 'beginner', 'Assis, pieds décollés, rotation du buste de gauche à droite.', false),
('Bicycle crunch', 'abs', array['core']::muscle_group[], 'bodyweight', array[]::text[], 'beginner', 'Allongé, alterner coude-genou opposés en pédalant.', false),
('Mountain climber', 'abs', array['core','cardio']::muscle_group[], 'bodyweight', array[]::text[], 'beginner', 'En position pompe, amener alternativement les genoux vers la poitrine.', false),
('Planche latérale', 'core', array['abs']::muscle_group[], 'bodyweight', array[]::text[], 'beginner', 'Corps aligné en appui sur le coude et les pieds de côté.', true),
('Dead bug', 'core', array['abs']::muscle_group[], 'bodyweight', array[]::text[], 'beginner', 'Allongé sur le dos, étendre bras et jambe opposés alternativement.', false),
('Ab wheel rollout', 'abs', array['core','shoulders']::muscle_group[], 'bodyweight', array['ab wheel'], 'intermediate', 'À genoux, faire rouler la roue vers l''avant en gardant le dos plat.', false),
('Hollow body hold', 'core', array['abs']::muscle_group[], 'bodyweight', array[]::text[], 'intermediate', 'Allongé, creuser le ventre, bras et jambes décollés et tendus.', false),
('Dragon flag', 'core', array['abs']::muscle_group[], 'bodyweight', array['bench'], 'elite', 'Allongé sur un banc, monter le corps droit comme une planche.', false),
('Hanging knee raise', 'abs', array['core']::muscle_group[], 'bodyweight', array['pull-up bar'], 'beginner', 'Suspendu à la barre, ramener les genoux vers la poitrine.', false),
('Toe to bar', 'abs', array['core']::muscle_group[], 'bodyweight', array['pull-up bar'], 'advanced', 'Suspendu, monter les pieds jusqu''à toucher la barre.', false),
('L-sit', 'core', array['abs','triceps']::muscle_group[], 'bodyweight', array['parallel bars'], 'advanced', 'En appui sur les barres, jambes tendues à l''horizontale.', false),
('Windshield wiper', 'core', array['abs']::muscle_group[], 'bodyweight', array['pull-up bar'], 'advanced', 'Suspendu, jambes tendues, pivoter de gauche à droite.', false),
('V-up', 'abs', array['core']::muscle_group[], 'bodyweight', array[]::text[], 'intermediate', 'Allongé, lever simultanément jambes et buste pour former un V.', false),

-- CARDIO
('HIIT (intervalles)', 'cardio', array[]::muscle_group[], 'cardio', array[]::text[], 'intermediate', 'Alternance d''efforts intenses et de récupération active.', false),
('Rameur', 'cardio', array['back','quadriceps']::muscle_group[], 'cardio', array['rowing ergometer'], 'beginner', 'Pousser avec les jambes, tirer la rame vers le ventre.', false),
('Vélo stationnaire', 'cardio', array[]::muscle_group[], 'cardio', array['stationary bike'], 'beginner', 'Pédalage à intensité modérée ou variable.', false),
('Burpee', 'cardio', array['chest','core']::muscle_group[], 'bodyweight', array[]::text[], 'intermediate', 'Squat, pompe, saut avec les bras en l''air.', false),
('Box jump', 'cardio', array['quadriceps','glutes']::muscle_group[], 'bodyweight', array['plyo box'], 'intermediate', 'Saut explosif sur une box, atterrir en squat.', false),
('Battle ropes', 'cardio', array['shoulders','core']::muscle_group[], 'cardio', array['battle ropes'], 'beginner', 'Onduler les cordes en alternant les bras rapidement.', false),
('Kettlebell swing', 'cardio', array['glutes','hamstrings','back']::muscle_group[], 'compound', array['kettlebell'], 'intermediate', 'Poussée de hanche explosive, balancer la kettlebell jusqu''à l''horizontale.', false),
('Ski erg', 'cardio', array['back','core']::muscle_group[], 'cardio', array['ski erg machine'], 'beginner', 'Tirer les poignées vers le bas en alternant les bras.', false),

-- MOBILITÉ SUPPLÉMENTAIRE
('Squat profond tenu', 'mobility', array['glutes','back']::muscle_group[], 'mobility', array[]::text[], 'beginner', 'Descendre en squat profond et tenir la position 30-60s.', false),
('Cat-cow', 'mobility', array['back']::muscle_group[], 'mobility', array[]::text[], 'beginner', 'À 4 pattes, alterner dos rond et dos creux.', false),
('World''s greatest stretch', 'mobility', array['glutes','hamstrings','shoulders']::muscle_group[], 'mobility', array[]::text[], 'beginner', 'Fente basse avec rotation du buste et du bras vers le plafond.', true),
('Pigeon yoga', 'mobility', array['glutes']::muscle_group[], 'mobility', array[]::text[], 'beginner', 'Jambe avant fléchie à 90° au sol, étirement profond du piriforme.', true),
('Étirement ischio allongé', 'mobility', array['hamstrings']::muscle_group[], 'mobility', array[]::text[], 'beginner', 'Allongé, jambe tendue vers le plafond tenue par les mains.', true),
('Ouverture de hanches', 'mobility', array['glutes']::muscle_group[], 'mobility', array[]::text[], 'beginner', 'Assis en tailleur avancé, appuyer doucement les genoux vers le sol.', false),
('Band pull-apart', 'mobility', array['shoulders','back']::muscle_group[], 'mobility', array['resistance band'], 'beginner', 'Bande tenue à bout de bras, écarter les mains en gardant les bras tendus.', false),
('Dislocate épaules', 'mobility', array['shoulders']::muscle_group[], 'mobility', array['pvc pipe'], 'beginner', 'Bâton tenu large, passer de devant à derrière en gardant les bras tendus.', false),
('Cossack squat', 'mobility', array['glutes','hamstrings']::muscle_group[], 'mobility', array[]::text[], 'intermediate', 'Pieds très écartés, s''asseoir sur un côté puis l''autre.', false),

-- ÉCHAUFFEMENT
('Jumping jack', 'warmup', array['cardio']::muscle_group[], 'bodyweight', array[]::text[], 'beginner', 'Sauts en écartant et ramenant simultanément bras et jambes.', false),
('High knees', 'warmup', array['cardio']::muscle_group[], 'bodyweight', array[]::text[], 'beginner', 'Courir sur place en montant les genoux à hauteur de hanche.', false),
('Butt kicks', 'warmup', array['hamstrings']::muscle_group[], 'bodyweight', array[]::text[], 'beginner', 'Courir sur place en ramenant les talons vers les fesses.', false),
('Leg swing', 'warmup', array['hamstrings','glutes']::muscle_group[], 'mobility', array[]::text[], 'beginner', 'Debout, balancer une jambe d''avant en arrière en amplitude croissante.', true),
('Arm circle', 'warmup', array['shoulders']::muscle_group[], 'mobility', array[]::text[], 'beginner', 'Cercles progressifs avec les bras, avant et arrière.', false),
('Inchworm', 'warmup', array['core','hamstrings']::muscle_group[], 'bodyweight', array[]::text[], 'beginner', 'Pencher vers l''avant, marcher sur les mains jusqu''en position pompe, revenir.', false),

-- KETTLEBELL
('Turkish get-up', 'core', array['shoulders','glutes']::muscle_group[], 'compound', array['kettlebell'], 'advanced', 'Se lever du sol jusqu''à la position debout en tenant la kettlebell à bout de bras.', true),
('Kettlebell snatch', 'shoulders', array['back','glutes']::muscle_group[], 'compound', array['kettlebell'], 'advanced', 'Balancer la kettlebell et la faire monter d''un seul mouvement au-dessus de la tête.', true),
('Kettlebell clean', 'shoulders', array['back','glutes']::muscle_group[], 'compound', array['kettlebell'], 'intermediate', 'Ramener la kettlebell de la position basse vers l''épaule en un mouvement.', true),
('Kettlebell goblet press', 'shoulders', array['triceps']::muscle_group[], 'compound', array['kettlebell'], 'beginner', 'Kettlebell tenue à deux mains, développé au-dessus de la tête.', false),
('Floor press kettlebell', 'chest', array['triceps']::muscle_group[], 'compound', array['kettlebell'], 'beginner', 'Allongé au sol, développé avec kettlebell, amplitude réduite.', false),

-- HALTÉROPHILIE / MOUVEMENTS OLYMPIQUES
('Clean & jerk', 'back', array['shoulders','glutes','quadriceps']::muscle_group[], 'compound', array['barbell'], 'elite', 'Épaulé-jeté : ramener la barre aux épaules puis la projeter au-dessus de la tête.', false),
('Arraché (snatch)', 'back', array['shoulders','glutes','quadriceps']::muscle_group[], 'compound', array['barbell'], 'elite', 'Soulever la barre d''un seul mouvement jusqu''au-dessus de la tête.', false),
('Power clean', 'back', array['glutes','quadriceps']::muscle_group[], 'compound', array['barbell'], 'advanced', 'Version simplifiée de l''épaulé, sans descente en squat complet.', false),
('Push press', 'shoulders', array['triceps','glutes']::muscle_group[], 'compound', array['barbell'], 'intermediate', 'Développé militaire avec poussée des jambes pour initier le mouvement.', false);
