insert into storage.buckets (id, name, public)
values
  ('progress-photos', 'progress-photos', false),
  ('exercise-media', 'exercise-media', true),
  ('recipe-images', 'recipe-images', true),
  ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- progress-photos: private, owner-only. Files must be stored under <user_id>/...
create policy progress_photos_select on storage.objects
  for select using (
    bucket_id = 'progress-photos' and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy progress_photos_insert on storage.objects
  for insert with check (
    bucket_id = 'progress-photos' and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy progress_photos_delete on storage.objects
  for delete using (
    bucket_id = 'progress-photos' and (storage.foldername(name))[1] = auth.uid()::text
  );

-- recipe-images: public read, owner-scoped write under <user_id>/...
create policy recipe_images_select on storage.objects
  for select using (bucket_id = 'recipe-images');
create policy recipe_images_insert on storage.objects
  for insert with check (
    bucket_id = 'recipe-images' and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy recipe_images_delete on storage.objects
  for delete using (
    bucket_id = 'recipe-images' and (storage.foldername(name))[1] = auth.uid()::text
  );

-- avatars: public read, owner-scoped write under <user_id>/...
create policy avatars_select on storage.objects
  for select using (bucket_id = 'avatars');
create policy avatars_insert on storage.objects
  for insert with check (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy avatars_update on storage.objects
  for update using (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );

-- exercise-media: public read, write reserved for service role (admin/seed only)
create policy exercise_media_select on storage.objects
  for select using (bucket_id = 'exercise-media');
