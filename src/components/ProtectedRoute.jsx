import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// 未ログインユーザーをログイン画面へリダイレクトするルートガード
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  // セッション確認中はローディング表示
  if (loading) return <div className="loading">読み込み中...</div>

  // 未認証の場合はログイン画面へ
  if (!user) return <Navigate to="/login" replace />

  return children
}
