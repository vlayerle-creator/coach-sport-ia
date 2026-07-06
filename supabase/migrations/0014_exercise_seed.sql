-- Seed: fundamental exercises
insert into public.exercises (name, primary_muscle, secondary_muscles, movement_type, equipment, level, instructions, is_unilateral) values
-- Poitrine
('Développé couché barre', 'chest', array['triceps','shoulders']::muscle_group[], 'compound', array['barbell','bench'], 'beginner', 'Allongé sur le banc, descendre la barre jusqu''à la poitrine puis pousser.', false),
('Développé couché haltères', 'chest', array['triceps','shoulders']::muscle_group[], 'compound', array['dumbbells','bench'], 'beginner', 'Même mouvement que barre mais avec haltères, amplitude plus grande.', false),
('Développé incliné barre', 'chest', array['shoulders','triceps']::muscle_group[], 'compound', array['barbell','incline bench'], 'intermediate', 'Banc incliné 30-45°, cible la partie haute de la poitrine.', false),
('Écarté haltères', 'chest', array['shoulders']::muscle_group[], 'isolation', array['dumbbells','bench'], 'beginner', 'Bras légèrement fléchis, descendre en arc de cercle et remonter.', false),
('Pompes', 'chest', array['triceps','shoulders','core']::muscle_group[], 'bodyweight', array[]::text[], 'beginner', 'Corps aligné, descendre jusqu''à effleurer le sol, pousser.', false),

-- Dos
('Tractions pronation', 'back', array['biceps']::muscle_group[], 'compound', array['pull-up bar'], 'intermediate', 'Prise large pronation, tirer jusqu''au menton au-dessus de la barre.', false),
('Tractions supination', 'back', array['biceps']::muscle_group[], 'compound', array['pull-up bar'], 'beginner', 'Prise étroite supination, tirer jusqu''au menton.', false),
('Tirage horizontal barre', 'back', array['biceps','core']::muscle_group[], 'compound', array['barbell'], 'intermediate', 'Tronc incliné à 45°, tirer la barre vers l''abdomen.', false),
('Tirage horizontal haltères', 'back', array['biceps']::muscle_group[], 'compound', array['dumbbells','bench'], 'beginner', 'Un genou sur le banc, tirer l''haltère vers la hanche.', true),
('Soulevé de terre', 'back', array['glutes','hamstrings','core']::muscle_group[], 'compound', array['barbell'], 'intermediate', 'Pieds à largeur de hanches, barre sur les tibias, dos plat, pousser le sol.', false),
('Soulevé de terre roumain', 'hamstrings', array['glutes','back']::muscle_group[], 'compound', array['barbell'], 'beginner', 'Jambes quasi-tendues, descendre la barre le long des jambes.', false),
('Tirage poulie haute', 'back', array['biceps']::muscle_group[], 'compound', array['cable machine'], 'beginner', 'Assis, prise large, tirer la barre vers la clavicule.', false),

-- Épaules
('Développé militaire barre', 'shoulders', array['triceps']::muscle_group[], 'compound', array['barbell'], 'intermediate', 'Debout ou assis, pousser la barre au-dessus de la tête.', false),
('Développé haltères épaules', 'shoulders', array['triceps']::muscle_group[], 'compound', array['dumbbells'], 'beginner', 'Assis, haltères à hauteur des épaules, pousser vers le haut.', false),
('Élévations latérales', 'shoulders', array[]::muscle_group[], 'isolation', array['dumbbells'], 'beginner', 'Debout, lever les bras sur les côtés jusqu''à l''horizontale.', false),
('Face pull', 'shoulders', array['back']::muscle_group[], 'isolation', array['cable machine'], 'beginner', 'Corde à hauteur du visage, tirer vers le front en ouvrant les coudes.', false),

-- Biceps
('Curl barre', 'biceps', array[]::muscle_group[], 'isolation', array['barbell'], 'beginner', 'Coudes fixes, fléchir les avant-bras vers les épaules.', false),
('Curl haltères', 'biceps', array[]::muscle_group[], 'isolation', array['dumbbells'], 'beginner', 'Alterner ou simultané, garder les coudes collés au corps.', true),
('Curl marteau', 'biceps', array[]::muscle_group[], 'isolation', array['dumbbells'], 'beginner', 'Prise neutre (pouce vers le haut), curl classique.', true),

-- Triceps
('Dips', 'triceps', array['chest','shoulders']::muscle_group[], 'bodyweight', array['dip bars'], 'intermediate', 'Corps vertical pour cibler les triceps, descendre jusqu''à 90° de flexion.', false),
('Extension triceps poulie', 'triceps', array[]::muscle_group[], 'isolation', array['cable machine'], 'beginner', 'Coudes fixes, pousser la corde vers le bas jusqu''à extension complète.', false),
('Développé fermé', 'triceps', array['chest']::muscle_group[], 'compound', array['barbell','bench'], 'intermediate', 'Prise serrée sur la barre, descendre vers le bas du sternum.', false),

-- Quadriceps
('Squat barre', 'quadriceps', array['glutes','hamstrings','core']::muscle_group[], 'compound', array['barbell'], 'intermediate', 'Barre sur les trapèzes, descendre jusqu''aux cuisses parallèles au sol.', false),
('Leg press', 'quadriceps', array['glutes','hamstrings']::muscle_group[], 'compound', array['leg press machine'], 'beginner', 'Pieds à largeur de hanches, descendre jusqu''à 90°.', false),
('Fentes', 'quadriceps', array['glutes','hamstrings']::muscle_group[], 'compound', array['dumbbells'], 'beginner', 'Grand pas en avant, genou arrière proche du sol.', true),
('Leg extension', 'quadriceps', array[]::muscle_group[], 'isolation', array['leg extension machine'], 'beginner', 'Assis, étendre les jambes jusqu''à la complète extension.', false),
('Goblet squat', 'quadriceps', array['glutes','core']::muscle_group[], 'compound', array['dumbbells'], 'beginner', 'Haltère tenu contre la poitrine, squat profond.', false),

-- Ischio-jambiers & Fessiers
('Hip thrust', 'glutes', array['hamstrings']::muscle_group[], 'compound', array['barbell','bench'], 'beginner', 'Dos contre banc, barre sur les hanches, pousser les hanches vers le haut.', false),
('Leg curl couché', 'hamstrings', array[]::muscle_group[], 'isolation', array['leg curl machine'], 'beginner', 'Allongé, fléchir les genoux pour ramener les talons vers les fesses.', false),

-- Abdos & Core
('Crunch', 'abs', array[]::muscle_group[], 'bodyweight', array[]::text[], 'beginner', 'Allongé, mains derrière la tête, soulever les épaules du sol.', false),
('Gainage (planche)', 'core', array['abs','shoulders']::muscle_group[], 'bodyweight', array[]::text[], 'beginner', 'Corps aligné en appui sur les avant-bras et les orteils.', false),
('Relevé de jambes', 'abs', array['core']::muscle_group[], 'bodyweight', array['pull-up bar'], 'intermediate', 'Suspendu ou allongé, monter les jambes à 90° en gardant le dos plat.', false),

-- Mollets
('Élévation des talons debout', 'calves', array[]::muscle_group[], 'isolation', array['calf raise machine'], 'beginner', 'Debout sur la pointe des pieds, monter et descendre lentement.', false),

-- Mobilité
('Étirement quadriceps debout', 'mobility', array[]::muscle_group[], 'mobility', array[]::text[], 'beginner', 'Debout sur une jambe, ramener le pied vers les fesses.', true),
('Rotation thoracique', 'mobility', array[]::muscle_group[], 'mobility', array[]::text[], 'beginner', 'À 4 pattes, main derrière la tête, rotation de la colonne thoracique.', true),
('Hip 90/90', 'mobility', array['glutes']::muscle_group[], 'mobility', array[]::text[], 'beginner', 'Assis au sol, jambes en 90/90, basculer d''un côté à l''autre.', false),

-- Cardio
('Course à pied', 'cardio', array[]::muscle_group[], 'cardio', array[]::text[], 'beginner', 'Course à intensité modérée, respiration nasale maintenue.', false),
('Vélo elliptique', 'cardio', array[]::muscle_group[], 'cardio', array['elliptical'], 'beginner', 'Mouvement elliptique, maintenir un rythme régulier.', false),
('Corde à sauter', 'cardio', array['calves']::muscle_group[], 'cardio', array['jump rope'], 'beginner', 'Sauts réguliers, poignets qui tournent, pas les bras entiers.', false);
