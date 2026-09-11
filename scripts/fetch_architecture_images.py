#!/usr/bin/env python3
import re
import json
import urllib.request
import urllib.parse
import sys
import time

HEADERS = {
    'User-Agent': 'EGEHistoryApp/1.0 (contact: ege-history-dev@gmail.com; educational app)'
}

CUSTOM_TITLES = {
    # Ancient Rus
    'arch-desyatinna': 'Десятинная церковь',
    'arch-sofia-kiev': 'Софийский собор (Киев)',
    'arch-sofia-novgorod': 'Софийский собор (Великий Новгород)',
    'arch-sofia-polotsk': 'Софийский собор (Полоцк)',
    'arch-spas-chernigov': 'Спасо-Преображенский собор (Чернигов)',
    'arch-zolotye-vorota-kiev': 'Золотые ворота (Киев)',
    'arch-georgiy-yuriev-monastyr': 'Георгиевский собор Юрьева монастыря',
    'arch-boris-gleb-kideksha': 'Церковь Бориса и Глеба (Кидекша)',
    'arch-spas-pereslavl': 'Спасо-Преображенский собор (Переславль-Залесский)',
    'arch-zolotye-vorota-vladimir': 'Золотые ворота (Владимир)',
    'arch-uspenskiy-vladimir': 'Успенский собор (Владимир, Россия)',
    'arch-bogolyubovo-castle': 'Палаты Андрея Боголюбского',
    'arch-pokrov-nerl': 'Церковь Покрова на Нерли',
    'arch-dmitrievskiy-vladimir': 'Дмитриевский собор (Владимир)',
    'arch-spas-nereditsa': 'Церковь Спаса на Нередице',
    'arch-paraskeva-pyatnitsa-novgorod': 'Церковь Параскевы Пятницы на Торгу',
    'arch-georgiy-yuriev-polskiy': 'Георгиевский собор (Юрьев-Польский)',

    # Moscow Tsardom
    'arch-spas-ilina': 'Церковь Спаса Преображения на Ильине улице',
    'arch-fedot-novgorod': 'Церковь Фёдора Стратилата на Ручью',
    'arch-kremlin-dmitry-donskoy': 'Московский Кремль при Дмитрии Донском',
    'arch-troitskiy-lavra': 'Троицкий собор Троице-Сергиевой лавры',
    'arch-andronikov-spas': 'Спасский собор Андроникова монастыря',
    'arch-uspenskiy-zvenigorod': 'Успенский собор на Городке',
    'arch-uspenskiy-moscow': 'Успенский собор (Москва)',
    'arch-granovitaya-palata': 'Грановитая палата',
    'arch-blagoveshchensky-moscow': 'Благовещенский собор (Москва)',
    'arch-rizopolozheniya-kremlin': 'Церковь Ризоположения (Москва)',
    'arch-kremlin-walls-red': 'Московский Кремль',
    'arch-arkhangelskiy-moscow': 'Архангельский собор (Москва)',
    'arch-ivan-velikiy': 'Колокольня Ивана Великого',
    'arch-voznesenie-kolomenskoe': 'Церковь Вознесения (Коломенское)',
    'arch-novodevichiy-smolensk': 'Смоленский собор Новодевичьего монастыря',
    'arch-vasiliy-blazhenny': 'Храм Василия Блаженного',
    'arch-smolensk-fortress': 'Смоленская крепостная стена',
    'arch-teremnoy-dvorets': 'Теремной дворец',
    'arch-troitsa-nikitniki': 'Церковь Троицы в Никитниках',
    'arch-rozhdestvo-putinki': 'Церковь Рождества Богородицы в Путинках',
    'arch-kolomenskoe-palace-wood': 'Дворец царя Алексея Михайловича (Коломенское)',
    'arch-novy-ierusalim': 'Новоиерусалимский монастырь',
    'arch-ilya-prorok-yaroslavl': 'Церковь Ильи Пророка (Ярославль)',
    'arch-tolchkovo-yaroslavl': 'Церковь Иоанна Предтечи в Толчкове',
    'arch-tserkov-pokrova-fili': 'Церковь Покрова в Филях',
    'arch-dubrovitsy-church': 'Знаменская церковь (Дубровицы)',
    'arch-sukhareva-bashnya': 'Сухарева башня',

    # Imperial
    'arch-menshikova-bashnya': 'Меншикова башня',
    'arch-menshikov-palace-spb': 'Меншиковский дворец (Санкт-Петербург)',
    'arch-letniy-dvorets-petra': 'Летний дворец Петра I',
    'arch-petropavlovskiy': 'Петропавловский собор',
    'arch-dvenadtsat-kollegiy': 'Здание Двенадцати коллегий',
    'arch-kunstkamera': 'Кунсткамера',
    'arch-petergof-palace': 'Большой Петергофский дворец',
    'arch-zimniy-dvorets': 'Зимний дворец',
    'arch-ekaterininskiy-tsarskoe': 'Екатерининский дворец',
    'arch-smolny-sobor': 'Смольный собор',
    'arch-nikolsky-sobor-spb': 'Никольский морской собор (Санкт-Петербург)',
    'arch-akademia-khudozhestv': 'Здание Императорской Академии художеств',
    'arch-mramorny-dvorets': 'Мраморный дворец',
    'arch-senat-moscow': 'Сенатский дворец',
    'arch-dom-pashkova': 'Дом Пашкова',
    'arch-tsaritsyno-palace': 'Царицыно (музей-заповедник)',
    'arch-tavricheskiy-dvorets': 'Таврический дворец',
    'arch-blagorodnoe-sobranie': 'Дом Союзов (Москва)',
    'arch-mikhailovskiy-zamok': 'Михайловский замок',
    'arch-kazanskiy-spb': 'Казанский собор (Санкт-Петербург)',
    'arch-birzha-spb': 'Здание биржи (Санкт-Петербург)',
    'arch-admiralteystvo': 'Главное адмиралтейство',
    'arch-glavniy-shtab-spb': 'Здание Главного штаба (Санкт-Петербург)',
    'arch-mikhailovskiy-dvorets-rus-museum': 'Михайловский дворец',
    'arch-alexandrinskiy-theatre': 'Александринский театр',
    'arch-senat-sinod-spb': 'Здание Сената и Синода',
    'arch-moscow-manezh': 'Манеж (Москва)',
    'arch-bolshoi-theatre-moscow': 'Большой театр',
    'arch-triumphal-arch-moscow': 'Триумфальные ворота (Москва)',
    'arch-narva-gate-spb': 'Нарвские триумфальные ворота',
    'arch-isaakievskiy': 'Исаакиевский собор',
    'arch-alexandrovskaya-kolonna': 'Александровская колонна',
    'arch-khram-khrista-spasitelya': 'Храм Христа Спасителя',
    'arch-bolshoy-kremlevskiy-dvorets': 'Большой Кремлёвский дворец',
    'arch-oruzheynaya-palata': 'Оружейная палата',
    'arch-tysyacheletie-rossii': 'Тысячелетие России',
    'arch-gosudarstvenny-istoricheskiy-muzey': 'Государственный исторический музей',
    'arch-gum-verhnie-ryady': 'ГУМ',
    'arch-spas-na-krovi': 'Спас на Крови',

    # Modern & Soviet
    'arch-osobnyak-ryabushinskogo': 'Особняк Рябушинского',
    'arch-yaroslavskiy-vokzal': 'Ярославский вокзал',
    'arch-hotel-metropol': 'Метрополь (гостиница, Москва)',
    'arch-dom-knigi-singer': 'Дом компании «Зингер»',
    'arch-kazanskiy-vokzal': 'Казанский вокзал',
    'arch-marfo-mariinskaya': 'Марфо-Мариинская обитель',
    'arch-shukhov-tower': 'Шуховская башня',
    'arch-lenin-mausoleum': 'Мавзолей Ленина',
    'arch-dom-melnikova': 'Дом Мельникова',
    'arch-klub-rusakova': 'Дом культуры имени Русакова',
    'arch-dom-narkomfina': 'Дом Наркомфина',
    'arch-lenin-library-rgb': 'Российская государственная библиотека',
    'arch-metro-mayakovskaya': 'Маяковская (станция метро, Москва)',
    'arch-severny-rechnoy-vokzal': 'Северный речной вокзал',
    'arch-mgu-vorobevy-gory': 'Главное здание МГУ',
    'arch-mid-building': 'Здание Министерства иностранных дел России',
    'arch-kotelnicheskaya-building': 'Жилой дом на Котельнической набережной',
    'arch-rodina-mat-volgograd': 'Родина-мать зовёт!',
    'arch-ostankino-tower': 'Останкинская телебашня'
}

def verify_image_url(url):
    """Checks if the URL returns HTTP 200 and image mime type."""
    if not url:
        return False
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(req, timeout=8) as resp:
            content_type = resp.headers.get('Content-Type', '')
            if resp.status == 200 and ('image/' in content_type or 'octet-stream' in content_type):
                return True
    except Exception:
        return False
    return False

def get_page_image_by_title(title):
    try:
        purl = f"https://ru.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=pageimages&pithumbsize=960&format=json"
        req = urllib.request.Request(purl, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=8) as r:
            pdata = json.loads(r.read().decode('utf-8'))
            pages = pdata.get('query', {}).get('pages', {})
            for pid, p in pages.items():
                if 'thumbnail' in p:
                    src = p['thumbnail']['source']
                    if verify_image_url(src):
                        return src
    except Exception:
        pass
    return None

def search_wikipedia_image(monument_id, name, city):
    # 1. Custom Title if mapped
    if monument_id in CUSTOM_TITLES:
        img = get_page_image_by_title(CUSTOM_TITLES[monument_id])
        if img:
            return img, CUSTOM_TITLES[monument_id]

    # 2. Clean bracketed descriptions
    clean_name = re.sub(r'\(.*?\)', '', name).strip()
    
    queries = [
        clean_name,
        f"{clean_name} {city}",
        f"{clean_name} ({city})"
    ]
    simple_name = re.sub(r'\s+в\s+[А-Яа-я\-]+', '', clean_name)
    if simple_name != clean_name:
        queries.append(f"{simple_name} ({city})")
        queries.append(f"{simple_name} {city}")
    
    # Try opensearch
    for q in queries:
        try:
            op_url = f"https://ru.wikipedia.org/w/api.php?action=opensearch&search={urllib.parse.quote(q)}&limit=3&format=json"
            req = urllib.request.Request(op_url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=6) as r:
                res = json.loads(r.read().decode('utf-8'))
                titles = res[1]
                for t in titles:
                    img = get_page_image_by_title(t)
                    if img:
                        return img, t
        except Exception:
            pass
            
    # Try search
    for q in queries[:2]:
        try:
            s_url = f"https://ru.wikipedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(q)}&utf8=&format=json"
            req = urllib.request.Request(s_url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=6) as r:
                res = json.loads(r.read().decode('utf-8'))
                results = res.get('query', {}).get('search', [])
                for item in results[:3]:
                    t = item['title']
                    img = get_page_image_by_title(t)
                    if img:
                        return img, t
        except Exception:
            pass
            
    return None, None

def process_file(filepath):
    print(f"\n==========================================")
    print(f"Processing {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Pattern to match { id: '...', name: '...', ... imageUrl: '...' }
    block_pattern = re.compile(r"id:\s*['\"]([^'\"]+)['\"].*?name:\s*['\"]([^'\"]+)['\"].*?imageUrl:\s*['\"]([^'\"]+)['\"]", re.DOTALL)
    
    matches = list(block_pattern.finditer(content))
    print(f"Found {len(matches)} monuments in {filepath}")
    
    replacements = {}
    found_count = 0
    
    for m in matches:
        monument_id = m.group(1)
        name = m.group(2)
        old_url = m.group(3)
        
        # Extract city if possible
        snippet = content[max(0, m.start() - 200):min(len(content), m.end() + 200)]
        city_match = re.search(r"city:\s*['\"]([^'\"]+)['\"]", snippet)
        city = city_match.group(1) if city_match else ""
        
        img_url, wiki_title = search_wikipedia_image(monument_id, name, city)
        
        if img_url:
            print(f"[{monument_id}] -> OK ({wiki_title})")
            replacements[old_url] = img_url
            found_count += 1
        else:
            print(f"[{monument_id}] -> NOT FOUND for {name}!")
        time.sleep(0.15)
        
    new_content = content
    for old, new in replacements.items():
        new_content = new_content.replace(f"imageUrl: '{old}'", f"imageUrl: '{new}'")
        new_content = new_content.replace(f'imageUrl: "{old}"', f"imageUrl: '{new}'")
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
    print(f"Result for {filepath}: {found_count}/{len(matches)} verified images updated!")
    return found_count, len(matches)

if __name__ == '__main__':
    files = sys.argv[1:] if len(sys.argv) > 1 else [
        'src/data/architecture/ancient.ts',
        'src/data/architecture/moscow_tsardom.ts',
        'src/data/architecture/imperial.ts',
        'src/data/architecture/modern_soviet.ts'
    ]
    total_found = 0
    total_all = 0
    for file in files:
        f_count, a_count = process_file(file)
        total_found += f_count
        total_all += a_count
    print(f"\n==========================================")
    print(f"FINAL TOTAL: {total_found}/{total_all} verified images found and updated!")
