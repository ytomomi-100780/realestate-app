import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import PropertyForm from '../components/PropertyForm'

export default function PropertiesPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const [properties, setProperties] = useState([])
  const [pageLoading, setPageLoading] = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState('')
  // 編集対象の物件オブジェクト（null = 新規登録モード）
  const [editingProperty, setEditingProperty] = useState(null)
  // フォームモーダルの表示フラグ
  const [showForm, setShowForm] = useState(false)

  // 自分が登録した物件一覧をSupabaseから取得
  const fetchProperties = useCallback(async () => {
    setPageLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError('物件の取得に失敗しました: ' + error.message)
    } else {
      setProperties(data)
    }
    setPageLoading(false)
  }, [])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  // 物件の新規登録（INSERT）または更新（UPDATE）
  const handleSubmit = async (formData) => {
    setFormLoading(true)
    setError('')

    if (editingProperty) {
      // UPDATE: 自分の物件のみ更新（RLSで保証）
      const { error } = await supabase
        .from('properties')
        .update({ name: formData.name, rent: formData.rent, area: formData.area, layout: formData.layout })
        .eq('id', editingProperty.id)

      if (error) {
        setError('更新に失敗しました: ' + error.message)
      } else {
        setShowForm(false)
        await fetchProperties()
      }
    } else {
      // INSERT: user_idにログイン中ユーザーのIDをセット（RLSで照合）
      const { error } = await supabase
        .from('properties')
        .insert({ ...formData, user_id: user.id })

      if (error) {
        setError('登録に失敗しました: ' + error.message)
      } else {
        setShowForm(false)
        await fetchProperties()
      }
    }

    setFormLoading(false)
  }

  // 物件の削除（DELETE）
  const handleDelete = async (id) => {
    if (!window.confirm('この物件を削除しますか？')) return

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)

    if (error) {
      setError('削除に失敗しました: ' + error.message)
    } else {
      await fetchProperties()
    }
  }

  // 新規登録モードでフォームを開く
  const handleOpenAdd = () => {
    setEditingProperty(null)
    setShowForm(true)
  }

  // 編集モードでフォームを開く
  const handleOpenEdit = (property) => {
    setEditingProperty(property)
    setShowForm(true)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="properties-container">
      <header className="properties-header">
        <h1>物件一覧</h1>
        <div className="header-right">
          <span className="user-email">{user?.email}</span>
          <button onClick={handleOpenAdd} className="btn-primary btn-add">
            ＋ 物件を登録
          </button>
          <button onClick={handleSignOut} className="btn-logout">
            ログアウト
          </button>
        </div>
      </header>

      <main className="properties-main">
        {error && <p className="error-message page-error">{error}</p>}

        {pageLoading ? (
          <p className="state-text">読み込み中...</p>
        ) : properties.length === 0 ? (
          <p className="state-text empty">
            登録された物件はありません。「＋ 物件を登録」から追加してください。
          </p>
        ) : (
          <div className="properties-grid">
            {properties.map((property) => (
              <div key={property.id} className="property-card">
                <h3 className="property-name">{property.name}</h3>
                <div className="property-info">
                  <span className="property-area">📍 {property.area}</span>
                  <span className="property-layout">🏠 {property.layout}</span>
                  <span className="property-rent">
                    ¥{property.rent.toLocaleString()} / 月
                  </span>
                </div>
                <div className="property-actions">
                  <button
                    onClick={() => handleOpenEdit(property)}
                    className="btn-edit"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDelete(property.id)}
                    className="btn-delete"
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* フォームモーダル（新規登録・編集） */}
      {showForm && (
        <PropertyForm
          property={editingProperty}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          loading={formLoading}
        />
      )}
    </div>
  )
}
