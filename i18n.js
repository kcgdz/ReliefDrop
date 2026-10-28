// Text-node translation keeps controls and their event listeners intact.
const pairs = [
['Geliştiren','Built by'],
['Görsellerin cihazında kalır','Your images stay on your device'],
['Görseli kaldır','Remove image'],['Başlamak için bir görsel ekle','Add an image to get started'],
['Pixern Studio logosu','Pixern Studio logo'],
['Fikrine boyut kat.','Give your ideas dimension.'],['Bir görselle başla. Gerisini şekillendir.','Start with an image. Shape what comes next.'],['Yerel işleme','Processed locally'],['Algılanan katmanlar','Detected layers'],['P logosu','P logo'],
['Görselden 3D modele, otomatik','From image to 3D, automatically'],
['Görsel seç, sürükle ya da yapıştır','Choose, drop or paste an image'],['Ctrl+V çalışır','Ctrl+V supported'],
['Dönüşüm modu','Conversion mode'],['Logo · Katmanlı','Logo · Layers'],['Rölyef · Fotoğraf','Relief · Photo'],
['Renkleri ayırır, her rengi ayrı bir katı katman olarak yükseltir. Logo, ikon, yazı ve çizimler için.','Separates colors into solid raised layers. For logos, icons, lettering and drawings.'],
['Parlaklığı yüksekliğe çevirir. Fotoğraf, doku, kabartma ve litofan için.','Converts brightness to height. For photos, textures and reliefs.'],
['Opak görsellerde arka plan da bir renk sayılır.','Opaque images include the background as a color.'],
['Sol tık: döndür · Sağ tık: kaydır · Tekerlek: yakınlaştır','Left drag: rotate · Right drag: pan · Scroll: zoom'],
['Uzun kenar (dışa aktarım ölçüsü)','Longest side (export size)'],
['Ters çevir (koyu = yüksek, litofan)','Invert (dark = high, lithophane)'],
['Görsel renklerini kullan','Use image colors'],['Kenar pikseli temizliği','Clean edge pixels'],['Arka planı kaldır','Remove background'],
['Plaka kalınlığı','Base thickness'],['Plaka payı','Base margin'],['Plaka rengi','Base color'],['Arka plaka','Backing plate'],
['Katman kademesi','Layer height step'],['Kenar yumuşatma','Edge smoothing'],['Gürültü filtresi','Noise filter'],
['Kabartma yüksekliği','Relief height'],['Taban kalınlığı','Base thickness'],['Izgara çözünürlüğü','Grid resolution'],
['Hazır ayarlar','Presets'],['Anahtarlık','Keychain'],['Kaşe','Stamp'],['Serbest','Custom'],
['Askı deliği','Keyring hole'],['Kaşe için aynala','Mirror for stamping'],
['Hazır ayarlar mevcut görsele uygulanır; ölçüleri dışa aktarmadan önce kontrol edin.','Presets apply to the current image; check dimensions before exporting.'],
['Kaynak','Source'],['Örnek','Sample'],['Temizle','Clear'],['Orijinal','Original'],['Analiz','Analysis'],['Renk sayısı','Colors'],['Otomatik','Auto'],['Çözünürlük','Resolution'],['Hızlı','Fast'],['Dengeli','Balanced'],['En detaylı','Highest detail'],['İnce','Fine'],['Sadeleştirme','Simplification'],['Katmanlar','Layers'],['Katman','Layer'],['Arka plan','Background'],['Geometri','Geometry'],['Kalınlık','Thickness'],['Yok','None'],['Silüet','Silhouette'],['Dikdörtgen','Rectangle'],['Rölyef','Relief'],['Yumuşatma','Smoothing'],['Malzeme','Material'],['Saten','Satin'],['Parlak','Glossy'],['Metaliklik','Metalness'],['Metalik','Metal'],['Mat','Matte'],['Pürüzlülük','Roughness'],['İzometrik','Isometric'],['Ön','Front'],['Yan','Side'],['Üst','Top'],['Döndür','Rotate'],['Süzül','Float'],['Tel kafes','Wireframe'],['Hazırlanıyor…','Preparing…'],['Analiz ediliyor…','Analyzing…'],['Görünür katman yok','No visible layers'],['bulunamadı','not found'],['görünür','visible'],['kapalı','off'],['Göster / gizle','Show / hide'],['göster veya gizle','show or hide'],['ek yükseklik','extra height'],['rengi','color'],['Açık / koyu tema','Light / dark theme'],['Temayı değiştir','Switch theme'],['Görünüm','View'],['3D yazıcı için','For 3D printing'],['Görüntüyü kaydet','Save image'],['Web, AR, Blender — renkli','Web, AR, Blender — color'],['Genel 3D programları','General 3D software'],["Bırak, 3D'ye çevireyim",'Drop to turn into 3D'],['indirildi','downloaded'],['oluşturulamadı','could not be created'],['renkli','color'],['uzun kenar','longest side'],
];
pairs.sort((a,b) => b[0].length-a[0].length);
let language = 'en';
try {
  const savedLanguage = localStorage.getItem('reliefdrop-language') || localStorage.getItem('pixer-language');
  if (savedLanguage === 'tr' || savedLanguage === 'en') language = savedLanguage;
} catch (_) {}
const originals = new WeakMap();
function translate(value) {
  // One pass prevents translated words being translated a second time.
  const escaped = pairs.map(([s]) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return value.replace(new RegExp(escaped.join('|'), 'g'), s => pairs.find(p => p[0] === s)[1]);
}
function update() {
  document.documentElement.lang = language;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const apply = (node, key) => {
    const value = key ? node.getAttribute(key) : node.nodeValue;
    let record = originals.get(node) || {};
    const id = key || 'text';
    if (!record[id] || record[id].shown !== value) record[id] = { original: value, shown: value };
    const next = language === 'en' ? translate(record[id].original) : record[id].original;
    if (next !== value) { if (key) node.setAttribute(key, next); else node.nodeValue = next; }
    record[id].shown = next; originals.set(node, record);
  };
  while (walker.nextNode()) if (!walker.currentNode.parentElement.closest('script,style,select#language')) apply(walker.currentNode);
  document.querySelectorAll('[title],[aria-label]').forEach(el => ['title','aria-label'].forEach(k => { if(el.hasAttribute(k)) apply(el,k); }));
}
window.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('language'); select.value = language;
  select.addEventListener('change', () => {
    language = select.value;
    try { localStorage.setItem('reliefdrop-language',language); } catch (_) {}
    update();
  });
  new MutationObserver(update).observe(document.body,{subtree:true,childList:true,characterData:true});
  update();
});
