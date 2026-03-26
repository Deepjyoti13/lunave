import { useEffect, useRef, useState } from 'react'
import { useAdminFetch } from '../context/AdminAuthContext'

const API = 'http://localhost:5000'
const CATEGORIES = ['Designer Delights','Travel Essentials','Special Occasions','Seasonal Sensations','Oud','Other']
const GENDERS     = ['Men','Women','Unisex']
const CONCS       = ['Parfum','Eau de Parfum','Eau de Toilette','Eau de Cologne','Body Mist']
const FAMILIES    = ['Floral','Oriental','Woody','Fresh','Citrus','Gourmand','Aquatic','Fougere','Other']
const EMPTY_FORM  = {
  name:'', basePrice:'', stock:'', category:'Designer Delights', gender:'Unisex',
  concentration:'Eau de Parfum', scentFamily:'Floral',
  shortDescription:'', description:'', storyTitle:'', storyContent:'',
  heartTitle:'', heartContent:'',
  scentNotes: { top:'', heart:'', base:'' },
  volumeOptions:'', occasion:'',
  isFeatured:false, isBestSeller:false, isNewArrival:false, isActive:true,
}

export default function Products() {
  const apiFetch = useAdminFetch()
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [modal,    setModal]    = useState(null)   // null | 'create' | 'edit'
  const [editing,  setEditing]  = useState(null)
  const [form,     setForm]     = useState(EMPTY_FORM)
  const [files,    setFiles]    = useState([])
  const [previews, setPreviews] = useState([])
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState('')
  const fileRef = useRef(null)

  const load = async () => {
    setLoading(true)
    const res  = await apiFetch('/products/admin/all')
    const data = await res.json()
    if (data.success) setProducts(data.products)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setForm(EMPTY_FORM)
    setFiles([]); setPreviews([]); setEditing(null); setError('')
    setModal('create')
  }

  const openEdit = (p) => {
    setForm({
      name: p.name, basePrice: p.basePrice, stock: p.stock,
      category: p.category, gender: p.gender,
      concentration: p.concentration, scentFamily: p.scentFamily || '',
      shortDescription: p.shortDescription || '', description: p.description || '',
      storyTitle: p.storyTitle || '', storyContent: p.storyContent || '',
      heartTitle: p.heartTitle || '', heartContent: p.heartContent || '',
      scentNotes: p.scentNotes || { top:'', heart:'', base:'' },
      volumeOptions: p.volumeOptions?.length
        ? JSON.stringify(p.volumeOptions.map(v => ({size:v.size, price:v.price, stock:v.stock})))
        : '',
      occasion: p.occasion?.join(',') || '',
      isFeatured: p.isFeatured, isBestSeller: p.isBestSeller,
      isNewArrival: p.isNewArrival, isActive: p.isActive,
    })
    setFiles([]); setPreviews([])
    setEditing(p); setError('')
    setModal('edit')
  }

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files)
    setFiles(prev => [...prev, ...selected])
    selected.forEach(f => {
      const reader = new FileReader()
      reader.onload = ev => setPreviews(p => [...p, ev.target.result])
      reader.readAsDataURL(f)
    })
  }

  const removePreview = (i) => {
    setFiles(prev => prev.filter((_,idx) => idx !== i))
    setPreviews(prev => prev.filter((_,idx) => idx !== i))
  }

  const handleSave = async () => {
    setError(''); setSaving(true)
    try {
      const fd = new FormData()
      const fields = ['name','basePrice','stock','category','gender','concentration',
        'scentFamily','shortDescription','description','storyTitle','storyContent',
        'heartTitle','heartContent']
      fields.forEach(k => fd.append(k, form[k] ?? ''))

      fd.append('isFeatured',   form.isFeatured)
      fd.append('isBesteller',  form.isBestSeller)
      fd.append('isNewArrival', form.isNewArrival)
      fd.append('isActive',     form.isActive)
      fd.append('scentNotes',   JSON.stringify(form.scentNotes))

      if (form.volumeOptions?.trim()) {
        try { fd.append('volumeOptions', JSON.stringify(JSON.parse(form.volumeOptions))) }
        catch { fd.append('volumeOptions', form.volumeOptions) }
      }
      if (form.occasion?.trim()) {
        fd.append('occasion', JSON.stringify(form.occasion.split(',').map(s => s.trim()).filter(Boolean)))
      }
      files.forEach(f => fd.append('images', f))

      const url = modal === 'edit' ? `/products/${editing._id}` : '/products'
      const res = await apiFetch(url, { method: modal === 'edit' ? 'PUT' : 'POST', body: fd })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setModal(null)
      await load()
    } catch(e) { setError(e.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product and all its images?')) return
    await apiFetch(`/products/${id}`, { method:'DELETE' })
    await load()
  }

  const toggleFlag = async (product, flag) => {
    const fd = new FormData()
    fd.append(flag, !product[flag])
    await apiFetch(`/products/${product._id}`, { method:'PUT', body: fd })
    await load()
  }

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  )

  const f = (k) => (e) => setForm(prev => ({...prev, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value}))
  const fNote = (k) => (e) => setForm(prev => ({...prev, scentNotes:{...prev.scentNotes,[k]:e.target.value}}))

  return (
    <div className="admin-page">
      <div className="admin-table-card">
        <div className="admin-table-header">
          <div className="admin-table-header-title"><em>Products</em></div>
          <div className="admin-filters">
            <div className="admin-search-wrap">
              <SearchIcon/>
              <input className="a-input admin-search-input" placeholder="Search products..." value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
            <button className="a-btn a-btn-gold" onClick={openCreate}>
              <PlusIcon/> Add Product
            </button>
          </div>
        </div>

        {loading ? (
          <div className="admin-loading"><div className="admin-spinner"/>Loading products...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Featured</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p._id}>
                  <td>
                    <div className="a-product-row">
                      {p.images?.[0]?.url
                        ? <img src={`${API}${p.images[0].url}`} className="a-product-thumb" alt={p.name}/>
                        : <div className="a-product-thumb" style={{background:'#1a1a1a',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'8px',color:'#555'}}>IMG</div>
                      }
                      <div>
                        <div style={{fontSize:'13px',fontWeight:'500',color:'var(--a-white)'}}>{p.name}</div>
                        <div style={{fontSize:'10px',color:'var(--a-white-dim)'}}>{p.concentration}</div>
                      </div>
                    </div>
                  </td>
                  <td>{p.category}</td>
                  <td style={{color:'var(--a-gold)'}}>
                    ${p.basePrice}
                    {p.volumeOptions?.length > 0 && <span style={{fontSize:'10px',color:'var(--a-white-dim)',marginLeft:'4px'}}>+{p.volumeOptions.length} sizes</span>}
                  </td>
                  <td>
                    <span style={{color: p.stock < 10 ? 'var(--a-danger)' : p.stock < 30 ? 'var(--a-warning)' : 'var(--a-success)'}}>
                      {p.stock}
                    </span>
                  </td>
                  <td>
                    <label className="a-toggle">
                      <input type="checkbox" checked={!!p.isFeatured} onChange={() => toggleFlag(p,'isFeatured')}/>
                      <div className="a-toggle-slider"/>
                    </label>
                  </td>
                  <td><span className={`admin-badge ${p.isActive?'active':'inactive'}`}>{p.isActive?'Active':'Inactive'}</span></td>
                  <td>
                    <div style={{display:'flex',gap:'6px'}}>
                      <button className="a-btn a-btn-outline a-btn-sm a-btn-icon" onClick={() => openEdit(p)} title="Edit"><EditIcon/></button>
                      <button className="a-btn a-btn-danger a-btn-sm a-btn-icon" onClick={() => handleDelete(p._id)} title="Delete"><TrashIcon/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr><td colSpan="7" style={{textAlign:'center',padding:'32px',color:'rgba(245,240,235,0.25)'}}>
                  {search ? 'No products match your search' : 'No products yet — add your first one'}
                </td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Modal ── */}
      {modal && (
        <div className="admin-modal-backdrop" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="admin-modal" style={{maxWidth:'700px'}}>
            <div className="admin-modal-header">
              <div className="admin-modal-title">{modal==='create'?'Add New Product':'Edit Product'}</div>
              <button className="admin-icon-btn" onClick={() => setModal(null)}><CloseIcon/></button>
            </div>
            <div className="admin-modal-body">
              {error && <div className="admin-error-msg" style={{marginBottom:'16px'}}>{error}</div>}

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
                <div className="a-form-group" style={{gridColumn:'1/-1'}}>
                  <label className="a-label">Product Name *</label>
                  <input className="a-input" value={form.name} onChange={f('name')} placeholder="e.g. Luxurious Elixir"/>
                </div>
                <div className="a-form-group">
                  <label className="a-label">Base Price ($) *</label>
                  <input className="a-input" type="number" value={form.basePrice} onChange={f('basePrice')} placeholder="250"/>
                </div>
                <div className="a-form-group">
                  <label className="a-label">Stock *</label>
                  <input className="a-input" type="number" value={form.stock} onChange={f('stock')} placeholder="50"/>
                </div>
                <div className="a-form-group">
                  <label className="a-label">Category *</label>
                  <select className="a-select" value={form.category} onChange={f('category')}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="a-form-group">
                  <label className="a-label">Gender</label>
                  <select className="a-select" value={form.gender} onChange={f('gender')}>
                    {GENDERS.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div className="a-form-group">
                  <label className="a-label">Concentration</label>
                  <select className="a-select" value={form.concentration} onChange={f('concentration')}>
                    {CONCS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="a-form-group">
                  <label className="a-label">Scent Family</label>
                  <select className="a-select" value={form.scentFamily} onChange={f('scentFamily')}>
                    {FAMILIES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="a-form-group" style={{gridColumn:'1/-1'}}>
                  <label className="a-label">Short Description</label>
                  <input className="a-input" value={form.shortDescription} onChange={f('shortDescription')} placeholder="One-liner for cards"/>
                </div>
                <div className="a-form-group" style={{gridColumn:'1/-1'}}>
                  <label className="a-label">Full Description</label>
                  <textarea className="a-textarea" rows={3} value={form.description} onChange={f('description')} placeholder="Full product description..."/>
                </div>

                {/* Scent Notes */}
                <div className="a-form-group" style={{gridColumn:'1/-1'}}>
                  <label className="a-label" style={{marginBottom:'10px'}}>Scent Notes</label>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'8px'}}>
                    <input className="a-input" placeholder="Top Note" value={form.scentNotes.top}   onChange={fNote('top')}/>
                    <input className="a-input" placeholder="Heart Note" value={form.scentNotes.heart} onChange={fNote('heart')}/>
                    <input className="a-input" placeholder="Base Note" value={form.scentNotes.base}  onChange={fNote('base')}/>
                  </div>
                </div>

                <div className="a-form-group">
                  <label className="a-label">Volume Options (JSON)</label>
                  <input className="a-input" value={form.volumeOptions} onChange={f('volumeOptions')} placeholder='[{"size":100,"price":250,"stock":30}]'/>
                </div>
                <div className="a-form-group">
                  <label className="a-label">Occasions (comma separated)</label>
                  <input className="a-input" value={form.occasion} onChange={f('occasion')} placeholder="Evening, Wedding, Casual"/>
                </div>

                {/* Flags */}
                <div style={{gridColumn:'1/-1',display:'flex',gap:'20px',flexWrap:'wrap',padding:'4px 0'}}>
                  {[['isFeatured','Featured'],['isBestSeller','Best Seller'],['isNewArrival','New Arrival'],['isActive','Active']].map(([key,label]) => (
                    <label key={key} style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer',fontSize:'12px',color:'var(--a-white-dim)'}}>
                      <label className="a-toggle">
                        <input type="checkbox" checked={!!form[key]} onChange={f(key)}/>
                        <div className="a-toggle-slider"/>
                      </label>
                      {label}
                    </label>
                  ))}
                </div>

                {/* Image Upload */}
                <div className="a-form-group" style={{gridColumn:'1/-1'}}>
                  <label className="a-label">Images (JPG, PNG, WebP — max 5MB each)</label>
                  <div className="a-upload-zone" onClick={() => fileRef.current?.click()}>
                    <UploadIcon/>
                    <p>Click to upload images (up to 6)</p>
                    {modal==='edit' && editing?.images?.length > 0 && (
                      <p style={{marginTop:'4px',fontSize:'11px',color:'var(--a-gold-dim)'}}>Product already has {editing.images.length} image(s) — upload to add more</p>
                    )}
                  </div>
                  <input ref={fileRef} type="file" multiple accept="image/*" style={{display:'none'}} onChange={handleFileChange}/>
                  {previews.length > 0 && (
                    <div className="a-image-preview-grid">
                      {previews.map((src,i) => (
                        <div className="a-image-preview" key={i}>
                          <img src={src} alt=""/>
                          <button className="a-image-preview-remove" onClick={() => removePreview(i)}>×</button>
                        </div>
                      ))}
                    </div>
                  )}
                  {modal==='edit' && editing?.images?.length > 0 && (
                    <div className="a-image-preview-grid" style={{marginTop:'8px'}}>
                      {editing.images.map((img,i) => (
                        <div className="a-image-preview" key={i}>
                          <img src={`${API}${img.url}`} alt=""/>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="a-btn a-btn-outline" onClick={() => setModal(null)}>Cancel</button>
              <button className="a-btn a-btn-gold" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : modal==='edit' ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SearchIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> }
function PlusIcon()   { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> }
function EditIcon()   { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> }
function TrashIcon()  { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg> }
function CloseIcon()  { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> }
function UploadIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{margin:'0 auto',display:'block',color:'var(--a-gold)'}}><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg> }
