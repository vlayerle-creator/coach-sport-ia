-- Machines & variantes manquantes
insert into public.exercises (name, primary_muscle, secondary_muscles, movement_type, equipment, level, instructions, is_unilateral) values

-- POITRINE MACHINES & VARIANTES
('Développé incliné machine', 'chest', array['triceps','shoulders']::muscle_group[], 'compound', array['incline chest press machine'], 'beginner', 'Machine guidée en position inclinée, cible le haut de la poitrine.', false),
('Développé décliné machine', 'chest', array['triceps']::muscle_group[], 'compound', array['decline chest press machine'], 'beginner', 'Machine guidée en position déclinée, cible le bas de la poitrine.', false),
('Développé couché machine (convergent)', 'chest', array['triceps','shoulders']::muscle_group[], 'compound', array['converging chest press machine'], 'beginner', 'Bras convergent vers le centre, simule le développé couché naturel.', false),
('Cable fly incliné', 'chest', array['shoulders']::muscle_group[], 'isolation', array['cable machine'], 'beginner', 'Poulies au-dessus, croiser les bras vers le bas et le centre.', false),
('Cable fly décliné', 'chest', array['shoulders']::muscle_group[], 'isolation', array['cable machine'], 'beginner', 'Poulies en bas, croiser les bras vers le haut et le centre.', false),
('Développé incliné haltères prise neutre', 'chest', array['triceps']::muscle_group[], 'compound', array['dumbbells','incline bench'], 'beginner', 'Banc incliné, prise neutre (paumes face à face).', false),
('Pec deck unilatéral', 'chest', array[]::muscle_group[], 'isolation', array['pec deck machine'], 'beginner', 'Un seul bras à la fois sur la machine butterfly.', true),
('Pompes archer', 'chest', array['triceps']::muscle_group[], 'bodyweight', array[]::text[], 'advanced', 'Pompes en décalant le poids sur un côté, bras opposé tendu.', true),
('Push-up avec élastique', 'chest', array['triceps','shoulders']::muscle_group[], 'bodyweight', array['resistance band'], 'intermediate', 'Élastique dans le dos, pompes avec résistance progressive.', false),

-- DOS MACHINES & VARIANTES
('Tirage vertical machine', 'back', array['biceps']::muscle_group[], 'compound', array['lat pulldown machine'], 'beginner', 'Machine guidée pour le tirage vertical, idéale pour débuter les tractions.', false),
('Tirage horizontal machine', 'back', array['biceps']::muscle_group[], 'compound', array['seated row machine'], 'beginner', 'Machine guidée pour le tirage horizontal, dos droit.', false),
('Tirage poulie basse neutre', 'back', array['biceps']::muscle_group[], 'compound', array['cable machine'], 'beginner', 'Poulie basse, prise neutre, tirer vers le ventre en gardant les coudes proches.', false),
('Tirage poulie haute prise serrée neutre', 'back', array['biceps']::muscle_group[], 'compound', array['cable machine'], 'beginner', 'Poignée neutre serrée à la poulie haute, tirer vers le menton.', false),
('Tirage supination machine', 'back', array['biceps']::muscle_group[], 'compound', array['lat pulldown machine'], 'beginner', 'Prise supination étroite sur la machine de tirage vertical.', false),
('Rowing barre prise large', 'back', array['biceps']::muscle_group[], 'compound', array['barbell'], 'intermediate', 'Tronc incliné, prise large, tirer la barre vers la poitrine haute.', false),
('Tirage ischio (straight arm pulldown)', 'back', array['core']::muscle_group[], 'isolation', array['cable machine'], 'intermediate', 'Bras tendus, pousser la corde vers les hanches depuis la poulie haute.', false),
('Machine dos convergente', 'back', array['biceps']::muscle_group[], 'compound', array['converging row machine'], 'beginner', 'Machine de rowing convergente, simule le tirage naturel.', false),

-- ÉPAULES MACHINES & VARIANTES
('Machine développé épaules', 'shoulders', array['triceps']::muscle_group[], 'compound', array['shoulder press machine'], 'beginner', 'Machine guidée pour le développé épaules, bon pour les débutants.', false),
('Machine développé épaules unilatéral', 'shoulders', array['triceps']::muscle_group[], 'compound', array['shoulder press machine'], 'intermediate', 'Un bras à la fois sur la machine de développé épaules.', true),
('Élévations latérales câble unilatéral bas', 'shoulders', array[]::muscle_group[], 'isolation', array['cable machine'], 'beginner', 'Poulie basse, lever le bras sur le côté, tension constante tout au long du mouvement.', true),
('Rear delt fly machine', 'shoulders', array['back']::muscle_group[], 'isolation', array['pec deck machine'], 'beginner', 'Machine butterfly inversée, écarter les bras vers l''arrière.', false),
('Shrugs barre', 'shoulders', array[]::muscle_group[], 'isolation', array['barbell'], 'beginner', 'Barre en prise pronation, hausser les épaules vers les oreilles.', false),
('Shrugs haltères', 'shoulders', array[]::muscle_group[], 'isolation', array['dumbbells'], 'beginner', 'Haltères de chaque côté, hausser les épaules.', false),
('Shrugs machine', 'shoulders', array[]::muscle_group[], 'isolation', array['shrug machine'], 'beginner', 'Machine dédiée aux trapèzes, hausser les épaules.', false),
('Élévations latérales sur banc incliné', 'shoulders', array[]::muscle_group[], 'isolation', array['dumbbells','incline bench'], 'intermediate', 'Allongé sur le côté sur banc incliné, lever l''haltère vers le plafond.', true),

-- BICEPS MACHINES & VARIANTES
('Curl machine', 'biceps', array[]::muscle_group[], 'isolation', array['bicep curl machine'], 'beginner', 'Machine guidée pour le curl biceps, isolation parfaite.', false),
('Curl pupitre barre', 'biceps', array[]::muscle_group[], 'isolation', array['barbell','preacher bench'], 'beginner', 'Barre droite sur pupitre, isolation maximale des biceps.', false),
('Curl pupitre haltère', 'biceps', array[]::muscle_group[], 'isolation', array['dumbbells','preacher bench'], 'beginner', 'Un haltère sur le pupitre, concentration sur le pic du biceps.', true),
('Curl pupitre barre EZ', 'biceps', array[]::muscle_group[], 'isolation', array['ez bar','preacher bench'], 'beginner', 'Barre EZ sur pupitre, moins de stress aux poignets.', false),
('Curl câble droit', 'biceps', array[]::muscle_group[], 'isolation', array['cable machine'], 'beginner', 'Barre droite à la poulie basse, curl avec tension constante.', false),
('Curl câble EZ', 'biceps', array[]::muscle_group[], 'isolation', array['cable machine'], 'beginner', 'Barre EZ à la poulie basse.', false),
('Curl marteau câble', 'biceps', array[]::muscle_group[], 'isolation', array['cable machine'], 'beginner', 'Corde à la poulie basse, prise neutre (marteau).', false),
('Zottman curl', 'biceps', array[]::muscle_group[], 'isolation', array['dumbbells'], 'intermediate', 'Monter en supination, descendre en pronation pour cibler aussi le brachio-radial.', false),
('Curl 21', 'biceps', array[]::muscle_group[], 'isolation', array['barbell'], 'intermediate', '7 reps demi-amplitude basse + 7 reps demi-amplitude haute + 7 reps amplitude complète.', false),

-- TRICEPS MACHINES & VARIANTES
('Extension triceps machine', 'triceps', array[]::muscle_group[], 'isolation', array['tricep extension machine'], 'beginner', 'Machine guidée pour l''extension des triceps.', false),
('Skull crusher barre EZ', 'triceps', array[]::muscle_group[], 'isolation', array['ez bar','bench'], 'intermediate', 'Même mouvement que skull crusher barre droite mais avec barre EZ.', false),
('Extension triceps haltère unilatéral debout', 'triceps', array[]::muscle_group[], 'isolation', array['dumbbells'], 'beginner', 'Un bras, haltère derrière la tête, extension vers le haut.', true),
('Extension triceps couché haltères', 'triceps', array[]::muscle_group[], 'isolation', array['dumbbells','bench'], 'beginner', 'Allongé, deux haltères, fléchir et étendre les coudes.', false),
('Cable kickback', 'triceps', array[]::muscle_group[], 'isolation', array['cable machine'], 'beginner', 'Poulie basse, tronc incliné, étendre le bras vers l''arrière.', true),
('Dips entre deux chaises', 'triceps', array['shoulders']::muscle_group[], 'bodyweight', array[]::text[], 'beginner', 'Mains sur deux chaises, descendre les fesses vers le sol.', false),

-- QUADRICEPS MACHINES & VARIANTES
('Presse à jambes 45°', 'quadriceps', array['glutes','hamstrings']::muscle_group[], 'compound', array['45 degree leg press'], 'beginner', 'Plateforme inclinée à 45°, pieds à largeur de hanches.', false),
('Presse à jambes pieds hauts', 'glutes', array['hamstrings']::muscle_group[], 'compound', array['leg press machine'], 'beginner', 'Pieds positionnés haut sur la plateforme, cible davantage les fessiers.', false),
('Presse à jambes pieds serrés', 'quadriceps', array[]::muscle_group[], 'compound', array['leg press machine'], 'intermediate', 'Pieds proches l''un de l''autre, isole l''extérieur des quadriceps.', false),
('Leg extension unilatéral', 'quadriceps', array[]::muscle_group[], 'isolation', array['leg extension machine'], 'beginner', 'Une jambe à la fois sur la machine à extension.', true),
('Hack squat machine', 'quadriceps', array['glutes']::muscle_group[], 'compound', array['hack squat machine'], 'intermediate', 'Machine guidée type smith inversée, descente profonde.', false),
('Presse à jambes horizontale', 'quadriceps', array['glutes']::muscle_group[], 'compound', array['horizontal leg press'], 'beginner', 'Presse horizontale, mouvement guidé, bon pour les genoux fragiles.', false),
('Fentes à la Smith machine', 'quadriceps', array['glutes','hamstrings']::muscle_group[], 'compound', array['smith machine'], 'beginner', 'Fentes guidées par la Smith machine, sécurité accrue.', true),
('Squat Smith machine', 'quadriceps', array['glutes']::muscle_group[], 'compound', array['smith machine'], 'beginner', 'Squat guidé par la barre Smith, bon pour débutants ou réhabilitation.', false),
('Squat à la poulie basse', 'quadriceps', array['glutes','core']::muscle_group[], 'compound', array['cable machine'], 'beginner', 'Câble basse entre les jambes, squat goblet avec résistance.', false),
('Split squat', 'quadriceps', array['glutes']::muscle_group[], 'compound', array[]::text[], 'beginner', 'Fente statique sans banc, travail d''équilibre et de force unilatérale.', true),

-- ISCHIO-JAMBIERS MACHINES & VARIANTES
('Leg curl debout', 'hamstrings', array[]::muscle_group[], 'isolation', array['standing leg curl machine'], 'beginner', 'Machine debout, fléchir une jambe à la fois.', true),
('Leg curl unilatéral couché', 'hamstrings', array[]::muscle_group[], 'isolation', array['leg curl machine'], 'beginner', 'Une jambe à la fois sur la machine de curl couché.', true),
('Leg curl assis unilatéral', 'hamstrings', array[]::muscle_group[], 'isolation', array['seated leg curl machine'], 'beginner', 'Une jambe à la fois sur la machine assise.', true),
('Romanian deadlift haltères', 'hamstrings', array['glutes','back']::muscle_group[], 'compound', array['dumbbells'], 'beginner', 'Haltères le long des jambes, descente avec dos plat, flexion de hanche.', false),
('Glute ham raise', 'hamstrings', array['glutes']::muscle_group[], 'bodyweight', array['glute ham raise machine'], 'advanced', 'Machine GHR, fléchir les genoux pour ramener le corps vertical.', false),

-- FESSIERS MACHINES & VARIANTES
('Machine abducteur debout', 'glutes', array[]::muscle_group[], 'isolation', array['cable machine'], 'beginner', 'Câble à la cheville, lever la jambe sur le côté.', true),
('Adducteur machine debout', 'glutes', array[]::muscle_group[], 'isolation', array['cable machine'], 'beginner', 'Câble à la cheville, ramener la jambe en travers du corps.', true),
('Hip thrust smith machine', 'glutes', array['hamstrings']::muscle_group[], 'compound', array['smith machine','bench'], 'beginner', 'Hip thrust avec la barre Smith, charge guidée et sécurisée.', false),
('Hip extension machine', 'glutes', array['hamstrings']::muscle_group[], 'isolation', array['hip extension machine'], 'beginner', 'Machine dédiée à l''extension de hanche, ciblage direct des fessiers.', false),
('Sumo deadlift haltères', 'glutes', array['hamstrings','back']::muscle_group[], 'compound', array['dumbbells'], 'beginner', 'Pieds écartés, haltères entre les jambes, dos plat.', false),

-- MOLLETS MACHINES & VARIANTES
('Presse mollets (sur leg press)', 'calves', array[]::muscle_group[], 'isolation', array['leg press machine'], 'beginner', 'Sur la presse à jambes, pousser sur la pointe des pieds.', false),
('Donkey calf raise', 'calves', array[]::muscle_group[], 'isolation', array['donkey calf raise machine'], 'intermediate', 'Tronc incliné à 90°, montées de talons lestées.', false),
('Calf raise Smith machine', 'calves', array[]::muscle_group[], 'isolation', array['smith machine'], 'beginner', 'Barre Smith sur les épaules, monter sur la pointe des pieds sur un step.', false),

-- CORE MACHINES & VARIANTES
('Rotation du buste machine', 'core', array['abs']::muscle_group[], 'isolation', array['rotary torso machine'], 'beginner', 'Assis sur la machine, rotation du buste contre la résistance.', false),
('Crunch machine', 'abs', array[]::muscle_group[], 'isolation', array['ab crunch machine'], 'beginner', 'Machine guidée, fléchir le buste vers les cuisses.', false),
('Decline crunch', 'abs', array[]::muscle_group[], 'bodyweight', array['decline bench'], 'intermediate', 'Sur banc décliné, crunch amplifié par la gravité.', false),
('Side bend haltère', 'core', array[]::muscle_group[], 'isolation', array['dumbbells'], 'beginner', 'Un haltère d''un côté, pencher le buste latéralement.', true),
('Copenhagen planche', 'core', array['abs','glutes']::muscle_group[], 'bodyweight', array['bench'], 'advanced', 'Planche latérale avec jambe supérieure sur le banc, bras tendu.', true),
('Rollout à genoux avec haltère', 'core', array['abs','shoulders']::muscle_group[], 'bodyweight', array['barbell'], 'intermediate', 'À genoux, faire rouler une barre chargée vers l''avant.', false),

-- POLYARTICULAIRES COMPLÉMENTAIRES
('Thruster', 'quadriceps', array['shoulders','glutes']::muscle_group[], 'compound', array['barbell'], 'intermediate', 'Squat frontal enchaîné directement avec développé militaire.', false),
('Thruster haltères', 'quadriceps', array['shoulders','glutes']::muscle_group[], 'compound', array['dumbbells'], 'beginner', 'Goblet squat enchaîné avec développé épaules.', false),
('Power snatch', 'back', array['shoulders','glutes']::muscle_group[], 'compound', array['barbell'], 'advanced', 'Version simplifiée de l''arraché, sans squat complet en réception.', false),
('Deadlift déficit', 'back', array['glutes','hamstrings']::muscle_group[], 'compound', array['barbell'], 'advanced', 'Debout sur des disques, amplitude de mouvement augmentée.', false),
('Deadlift barre hexagonale', 'back', array['glutes','quadriceps']::muscle_group[], 'compound', array['hex bar'], 'intermediate', 'Barre hexagonale, prise neutre, plus naturel pour les genoux.', false),
('Farmer walk', 'core', array['shoulders','hamstrings']::muscle_group[], 'compound', array['dumbbells'], 'beginner', 'Marcher en portant des charges lourdes de chaque côté.', false),
('Suitcase carry', 'core', array['shoulders']::muscle_group[], 'compound', array['dumbbells'], 'intermediate', 'Marcher en portant une charge d''un seul côté, gainage anti-latéral.', true),
('Overhead carry', 'shoulders', array['core']::muscle_group[], 'compound', array['dumbbells'], 'intermediate', 'Marcher en maintenant un haltère ou kettlebell au-dessus de la tête.', true),
('Bear crawl', 'core', array['shoulders','quadriceps']::muscle_group[], 'bodyweight', array[]::text[], 'beginner', 'Marcher à 4 pattes en gardant les genoux légèrement décollés du sol.', false),
('Renegade row', 'back', array['core','biceps']::muscle_group[], 'compound', array['dumbbells'], 'intermediate', 'En position pompe sur deux haltères, tirer alternativement vers la hanche.', true);
