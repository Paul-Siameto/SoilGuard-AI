-- Create storage buckets for land management features

-- Create land-images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('land-images', 'land-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create land-documents bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('land-documents', 'land-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for land-images
CREATE POLICY "Users can upload their own land images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'land-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own land images"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'land-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own land images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'land-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage policies for land-documents
CREATE POLICY "Users can upload their own land documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'land-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own land documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'land-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own land documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'land-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
