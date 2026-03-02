insert into domain_options (name, color, source) values
('arcana', '#664295', 'SRD'),
('blade', '#b93035', 'SRD'),
('bone', '#c1c7cc', 'SRD'),
('codex', '#3370ab', 'SRD'),
('grace', '#cb3b90', 'SRD'),
('midnight', '#2c2c2c', 'SRD'),
('sage', '#0e854d', 'SRD'),
('splendor', '#d1b447', 'SRD'),
('valor', '#dc7a27', 'SRD'),
('dread', '#362b6c', 'The Void'),
('blood', '#7a0e0e', 'The Void');
--> statement-breakpoint
insert into class_options (name, domain_primary, domain_secondary, source) values
('bard', 'grace', 'codex', 'SRD'),
('druid', 'sage', 'arcana', 'SRD'),
('guardian', 'valor', 'blade', 'SRD'),
('ranger', 'bone', 'sage', 'SRD'),
('rogue', 'midnight', 'grace', 'SRD'),
('seraph', 'splendor', 'valor', 'SRD'),
('sorcerer', 'arcana', 'midnight', 'SRD'),
('warrior', 'blade', 'bone', 'SRD'),
('wizard', 'codex', 'splendor', 'SRD'),
('warlock', 'dread', 'grace', 'The Void'),
('brawler', 'bone', 'valor', 'The Void'),
('assassin', 'midnight', 'blade', 'The Void'),
('witch', 'dread', 'sage', 'The Void'),
('blood hunter', 'blade', 'blood', 'The Void');