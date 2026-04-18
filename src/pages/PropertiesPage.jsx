import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// ダミーの物件データ
const PROPERTIES = [
  { id: 1, name: 'サンシャインマンション 101号室', rent: 85000, area: '渋谷区' },
  { id: 2, name: 'グリーンハイツ 203号室', rent: 72000, area: '新宿区' },
  { id: 3, name: 'シーサイドアパート 305号室', rent: 95000, area: '港区' },
  { id: 4, name: 'スカイタワー 1201号室', rent: 120000, area: '千代田区' },
  { id: 5, name: 'パークビュー目黒 402号室', rent: 68000, area: '目黒区' },
  { id: 6, name: 'ソレイユ赤坂 801号室', rent: 150000, area: '港区赤坂' },
]

export default function PropertiesPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

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
          <button onClick={handleSignOut} className="btn-logout">
            ログアウト
          </button>
        </div>
      </header>
      <main className="properties-grid">
        {PROPERTIES.map((property) => (
          <div key={property.id} className="property-card">
            <h3 className="property-name">{property.name}</h3>
            <div className="property-info">
              <span className="property-area">📍 {property.area}</span>
              <span className="property-rent">
                ¥{property.rent.toLocaleString()} / 月
              </span>
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}
