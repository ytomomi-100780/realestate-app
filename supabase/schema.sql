-- =============================================
-- 不動産物件テーブル
-- =============================================
CREATE TABLE properties (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    uuid        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name       text        NOT NULL,
  rent       integer     NOT NULL CHECK (rent > 0),
  area       text        NOT NULL,
  layout     text        NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- =============================================
-- Row Level Security（RLS）の有効化
-- =============================================
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- 自分が登録した物件のみ参照可能
CREATE POLICY "自分の物件のみ参照可能" ON properties
  FOR SELECT
  USING (auth.uid() = user_id);

-- 自分のuser_idに紐づく物件のみ登録可能
CREATE POLICY "自分の物件のみ登録可能" ON properties
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 自分が登録した物件のみ更新可能
CREATE POLICY "自分の物件のみ更新可能" ON properties
  FOR UPDATE
  USING (auth.uid() = user_id);

-- 自分が登録した物件のみ削除可能
CREATE POLICY "自分の物件のみ削除可能" ON properties
  FOR DELETE
  USING (auth.uid() = user_id);
