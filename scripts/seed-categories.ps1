param(
  [Parameter(Mandatory=$false)]
  [string]$ApiKey = (Get-Content ".env.local" | Where-Object { $_ -match "^APPWRITE_API_KEY=" } | ForEach-Object { $_ -replace "^APPWRITE_API_KEY=", "" })
)

$endpoint  = "https://nyc.cloud.appwrite.io/v1"
$projectId = "69c138dc003803eb6ca8"
$dbId      = "laboutiquerd"
$colId     = "categories"

$headers = @{
  "X-Appwrite-Project" = $projectId
  "X-Appwrite-Key"     = $ApiKey
  "Content-Type"       = "application/json"
}

$categories = @(
  @{id="cat-moda-ropa";    key="Moda & Ropa";          name="Moda & Ropa";          nameEn="Fashion & Clothing"; nameFr="Mode & Vetements";     emoji="";  sortOrder=1;  isActive=$true; image="https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=400&q=80"},
  @{id="cat-calzado";      key="Calzado";              name="Calzado";              nameEn="Footwear";           nameFr="Chaussures";           emoji="";  sortOrder=2;  isActive=$true; image="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80"},
  @{id="cat-accesorios";   key="Accesorios";           name="Accesorios";           nameEn="Accessories";        nameFr="Accessoires";          emoji="";  sortOrder=3;  isActive=$true; image="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80"},
  @{id="cat-alta-joyeria"; key="Alta Joyeria";         name="Alta Joyeria";         nameEn="Fine Jewelry";       nameFr="Haute Joaillerie";     emoji="";  sortOrder=4;  isActive=$true; image="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80"},
  @{id="cat-bisuteria";    key="Bisuteria";            name="Bisuteria";            nameEn="Costume Jewelry";    nameFr="Bijoux Fantaisie";     emoji="";  sortOrder=5;  isActive=$true; image="https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&q=80"},
  @{id="cat-cuidado";      key="Cuidado Personal";     name="Cuidado Personal";     nameEn="Personal Care";      nameFr="Soin Personnel";       emoji="";  sortOrder=6;  isActive=$true; image="https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=400&q=80"},
  @{id="cat-perfumes";     key="Perfumes";             name="Perfumes";             nameEn="Fragrances";         nameFr="Parfums";              emoji="";  sortOrder=7;  isActive=$true; image="https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&q=80"},
  @{id="cat-artesania";    key="Artesania";            name="Artesania";            nameEn="Handicrafts";        nameFr="Artisanat";            emoji="";  sortOrder=8;  isActive=$true; image="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"},
  @{id="cat-hogar";        key="Articulos del Hogar";  name="Articulos del Hogar";  nameEn="Home Goods";         nameFr="Articles Menagers";    emoji="";  sortOrder=9;  isActive=$true; image="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80"},
  @{id="cat-personales";   key="Articulos Personales"; name="Articulos Personales"; nameEn="Personal Items";     nameFr="Articles Personnels";  emoji="";  sortOrder=10; isActive=$true; image="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80"},
  @{id="cat-juguetes";     key="Juguetes";             name="Juguetes";             nameEn="Toys";               nameFr="Jouets";               emoji="";  sortOrder=11; isActive=$true; image="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&q=80"},
  @{id="cat-tecnologia";   key="Tecnologia";           name="Tecnologia";           nameEn="Technology";         nameFr="Technologie";          emoji="";  sortOrder=12; isActive=$true; image="https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&q=80"},
  @{id="cat-bolsos";       key="Bolsos & Carteras";    name="Bolsos & Carteras";    nameEn="Bags & Wallets";     nameFr="Sacs & Portefeuilles"; emoji="";  sortOrder=13; isActive=$true; image="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80"},
  @{id="cat-ropa-int";     key="Ropa Interior";        name="Ropa Interior";        nameEn="Underwear";          nameFr="Sous-vetements";       emoji="";  sortOrder=14; isActive=$true; image="https://images.unsplash.com/photo-1624206112918-f140f087f9b5?w=400&q=80"},
  @{id="cat-deportes";     key="Deportes";             name="Deportes";             nameEn="Sports";             nameFr="Sports";               emoji="";  sortOrder=15; isActive=$true; image="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&q=80"}
)

Write-Host "`nInsertando categorias en Appwrite..." -ForegroundColor Cyan

$ok = 0; $fail = 0

foreach ($cat in $categories) {
  $url  = "$endpoint/databases/$dbId/collections/$colId/documents"
  $data = [ordered]@{
    key       = $cat.key
    name      = $cat.name
    nameEn    = $cat.nameEn
    nameFr    = $cat.nameFr
    emoji     = $cat.emoji
    image     = $cat.image
    sortOrder = $cat.sortOrder
    isActive  = $cat.isActive
  }
  $body = [ordered]@{ documentId = $cat.id; data = $data } | ConvertTo-Json -Depth 5 -Compress

  try {
    Invoke-RestMethod -Method POST -Uri $url -Headers $headers -Body $body | Out-Null
    Write-Host "  OK  $($cat.name)" -ForegroundColor Green
    $ok++
  } catch {
    $code = $_.Exception.Response.StatusCode.value__
    if ($code -eq 409) {
      Write-Host "  --  $($cat.name) (ya existe)" -ForegroundColor Yellow
      $ok++
    } else {
      Write-Host "  ERR $($cat.name): $($_.Exception.Message)" -ForegroundColor Red
      $fail++
    }
  }
}

Write-Host "`nFinalizado: $ok OK, $fail errores" -ForegroundColor $(if ($fail -eq 0) {"Green"} else {"Yellow"})
