import { useState, useEffect } from 'react'

// 物件の新規登録・編集フォームモーダル
// property が渡された場合は編集モード、null の場合は新規登録モード
export default function PropertyForm({ property, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({ name: '', rent: '', area: '', layout: '' })

  // 編集モードのときは既存データをフォームに反映
  useEffect(() => {
    if (property) {
      setForm({
        name: property.name,
        rent: String(property.rent),
        area: property.area,
        layout: property.layout,
      })
    } else {
      setForm({ name: '', rent: '', area: '', layout: '' })
    }
  }, [property])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // rentは数値に変換して親へ渡す
    onSubmit({ ...form, rent: parseInt(form.rent, 10) })
  }

  return (
    // オーバーレイクリックでモーダルを閉じる
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{property ? '物件を編集' : '物件を登録'}</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">物件名</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="サンシャインマンション 101号室"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="rent">家賃（円）</label>
            <input
              id="rent"
              name="rent"
              type="number"
              value={form.rent}
              onChange={handleChange}
              placeholder="80000"
              min="1"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="area">エリア名</label>
            <input
              id="area"
              name="area"
              type="text"
              value={form.area}
              onChange={handleChange}
              placeholder="渋谷区"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="layout">間取り</label>
            <input
              id="layout"
              name="layout"
              type="text"
              value={form.layout}
              onChange={handleChange}
              placeholder="1LDK"
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onCancel} className="btn-secondary">
              キャンセル
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? '保存中...' : property ? '更新する' : '登録する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
