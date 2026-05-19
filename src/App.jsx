import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

// 1. 최신 챔피언 리스트 (한글명: 영문ID) - 누락 방지를 위해 상단에 고정
const ALL_CHAMPIONS = [
  { ko: "가렌", en: "Garen" }, { ko: "갈리오", en: "Galio" }, { ko: "갱플랭크", en: "Gangplank" }, { ko: "그라가스", en: "Gragas" }, { ko: "그레이브즈", en: "Graves" }, { ko: "그웬", en: "Gwen" }, { ko: "나르", en: "Gnar" }, { ko: "나미", en: "Nami" }, { ko: "나서스", en: "Nasus" }, { ko: "나피리", en: "Naafiri" }, { ko: "노틸러스", en: "Nautilus" }, { ko: "녹턴", en: "Nocturne" }, { ko: "누누와 윌럼프", en: "Nunu" }, { ko: "니달리", en: "Nidalee" }, { ko: "니코", en: "Neeko" }, { ko: "닐라", en: "Nilah" }, { ko: "다리우스", en: "Darius" }, { ko: "다이애나", en: "Diana" }, { ko: "드레이븐", en: "Draven" }, { ko: "라이즈", en: "Ryze" }, { ko: "라칸", en: "Rakan" }, { ko: "람머스", en: "Rammus" }, { ko: "럭스", en: "Lux" }, { ko: "럼블", en: "Rumble" }, { ko: "레나타 글라스크", en: "Renata" }, { ko: "레넥톤", en: "Renekton" }, { ko: "레오나", en: "Leona" }, { ko: "렉사이", en: "RekSai" }, { ko: "렐", en: "Rell" }, { ko: "렝가", en: "Rengar" }, { ko: "루시안", en: "Lucian" }, { ko: "룰루", en: "Lulu" }, { ko: "르블랑", en: "Leblanc" }, { ko: "리 신", en: "LeeSin" }, { ko: "리븐", en: "Riven" }, { ko: "리산드라", en: "Lissandra" }, { ko: "릴리아", en: "Lillia" }, { ko: "마스터 이", en: "MasterYi" }, { ko: "마오카이", en: "Maokai" }, { ko: "말자하", en: "Malzahar" }, { ko: "말파이트", en: "Malphite" }, { ko: "멜", en: "Mel" }, { ko: "모데카이저", en: "Mordekaiser" }, { ko: "모르가나", en: "Morgana" }, { ko: "문도 박사", en: "DrMundo" }, { ko: "미스 포츈", en: "MissFortune"}, { ko: "밀리오", en: "Milio" }, { ko: "바루스", en: "Varus" }, { ko: "바드", en: "Bard" }, { ko: "바이", en: "Vi" }, { ko: "벡스", en: "Vex" }, { ko: "베인", en: "Vayne" }, { ko: "베이가", en: "Veigar" }, { ko: "벨베스", en: "Belveth" }, { ko: "벨코즈", en: "Velkoz" }, { ko: "볼리베어", en: "Volibear" }, { ko: "브라움", en: "Braum" }, { ko: "브라이어", en: "Briar" }, { ko: "브랜드", en: "Brand" }, { ko: "블라디미르", en: "Vladimir" }, { ko: "블리츠크랭크", en: "Blitzcrank" }, { ko: "비에고", en: "Viego" }, { ko: "빅토르", en: "Viktor" }, { ko: "뽀삐", en: "Poppy" }, { ko: "사미라", en: "Samira" }, { ko: "사이온", en: "Sion" }, { ko: "사일러스", en: "Sylas" }, { ko: "샤코", en: "Shaco" }, { ko: "세나", en: "Senna" }, { ko: "세라핀", en: "Seraphine" }, { ko: "세주아니", en: "Sejuani" }, { ko: "세트", en: "Sett" }, { ko: "소나", en: "Sona" }, { ko: "소라카", en: "Soraka" }, { ko: "쉔", en: "Shen" }, { ko: "쉬바나", en: "Shyvana" }, { ko: "스웨인", en: "Swain" }, { ko: "스카너", en: "Skarner" }, { ko: "스몰더", en: "Smolder" }, { ko: "시비르", en: "Sivir" }, { ko: "신 짜오", en: "XinZhao" }, { ko: "신드라", en: "Syndra" }, { ko: "신지드", en: "Singed" }, { ko: "쓰레쉬", en: "Thresh" }, { ko: "아리", en: "Ahri" }, { ko: "아무무", en: "Amumu" }, { ko: "아우렐리온 솔", en: "AurelionSol" }, { ko: "아이번", en: "Ivern" }, { ko: "아지르", en: "Azir" }, { ko: "아칼리", en: "Akali" }, { ko: "아크샨", en: "Akshan" }, { ko: "아트록스", en: "Aatrox" }, { ko: "아펠리오스", en: "Aphelios" }, { ko: "알리스타", en: "Alistar" }, { ko: "암베사", en: "Ambessa" }, { ko: "애니", en: "Annie" }, { ko: "애니비아", en: "Anivia" }, { ko: "애쉬", en: "Ashe" }, { ko: "야스오", en: "Yasuo" }, { ko: "에코", en: "Ekko" }, { ko: "엘리스", en: "Elise" }, { ko: "오공", en: "MonkeyKing" }, { ko: "오로라", en: "Aurora" }, { ko: "오른", en: "Ornn" }, { ko: "오리아나", en: "Orianna" }, { ko: "올라프", en: "Olaf" }, { ko: "요네", en: "Yone" }, { ko: "요릭", en: "Yorick" }, { ko: "우디르", en: "Udyr" }, { ko: "우르곳", en: "Urgot" }, { ko: "워윅", en: "Warwick" }, { ko: "유나라", en: "Yunara" }, { ko: "유미", en: "Yuumi" }, { ko: "이렐리아", en: "Irelia" }, { ko: "이블린", en: "Evelynn" }, { ko: "이즈리얼", en: "Ezreal" }, { ko: "일라오이", en: "Illaoi" }, { ko: "자르반 4세", en: "JarvanIV" }, { ko: "자야", en: "Xayah" }, { ko: "자이라", en: "Zyra" }, { ko: "자크", en: "Zac" }, { ko: "자헨", en: "Zaahen" }, { ko: "잔나", en: "Janna" }, { ko: "잭스", en: "Jax" }, { ko: "제드", en: "Zed" }, { ko: "제라스", en: "Xerath" }, { ko: "제리", en: "Zeri" }, { ko: "제이스", en: "Jayce" }, { ko: "조이", en: "Zoe" }, { ko: "직스", en: "Ziggs" }, { ko: "진", en: "Jhin" }, { ko: "질리언", en: "Zilean" }, { ko: "징크스", en: "Jinx" }, { ko: "초가스", en: "Chogath" }, { ko: "카르마", en: "Karma" }, { ko: "카밀", en: "Camille" }, { ko: "카사딘", en: "Kassadin" }, { ko: "카서스", en: "Karthus" }, { ko: "카시오페아", en: "Cassiopeia" }, { ko: "카이사", en: "Kaisa" }, { ko: "카직스", en: "Khazix" }, { ko: "카타리나", en: "Katarina" }, { ko: "칼리스타", en: "Kalista" }, { ko: "케넨", en: "Kennen" }, { ko: "케이틀린", en: "Caitlyn" }, { ko: "케인", en: "Kayn" }, { ko: "케일", en: "Kayle" }, { ko: "코그모", en: "KogMaw" }, { ko: "코르키", en: "Corki" }, { ko: "퀸", en: "Quinn" }, { ko: "크산테", en: "K'sante" }, { ko: "클레드", en: "Kled" }, { ko: "키아나", en: "Qiyana" }, { ko: "킨드레드", en: "Kindred" }, { ko: "타릭", en: "Taric" }, { ko: "탈론", en: "Talon" }, { ko: "탈리야", en: "Taliyah" }, { ko: "탐 켄치", en: "TahmKench" }, { ko: "트런들", en: "Trundle" }, { ko: "트리스타나", en: "Tristana" }, { ko: "트린다미어", en: "Tryndamere" }, { ko: "트위스티드 페이트", en: "TwistedFate" }, { ko: "트위치", en: "Twitch" }, { ko: "티모", en: "Teemo" }, { ko: "파이크", en: "Pyke" }, { ko: "판테온", en: "Pantheon" }, { ko: "피들스틱", en: "Fiddlesticks" }, { ko: "피오라", en: "Fiora" }, { ko: "피즈", en: "Fizz" }, { ko: "하이머딩거", en: "Heimerdinger" }, { ko: "헤카림", en: "Hecarim" }, { ko: "흐웨이", en: "Hwei" }
].sort((a, b) => a.ko.localeCompare(b.ko));

// 2. 자동완성 컴포넌트 (디자인 원복 및 이미지 통합)
const ChampionAutocomplete = ({ value, onChange, placeholder, style }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  // 버전 없이도 잘 나오는 라이엇 정적 이미지 경로
  const getImgUrl = (enId) => {
    if (!enId) return '';
    return `https://ddragon.leagueoflegends.com/cdn/img/champion/tiles/${enId}_0.jpg`;
  };

  useEffect(() => {
    const matched = ALL_CHAMPIONS.find(c => c.en === value);
    setSearchTerm(matched ? matched.ko : value);
  }, [value]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (val.trim().length > 0) {
      const searchKey = val.toLowerCase().replace(/\s+/g, '');
      const filtered = ALL_CHAMPIONS.filter(c => 
        c.ko.replace(/\s+/g, '').includes(searchKey) || 
        c.en.toLowerCase().includes(searchKey)
      );
      setSuggestions(filtered.slice(0, 8));
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (champ) => {
    setSearchTerm(champ.ko);
    onChange(champ.en);
    setSuggestions([]);
    setIsFocused(false);
  };

  return (
    <div style={{ position: 'relative', width: style.width || '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {value && (
          <img 
            src={getImgUrl(value)} 
            alt="" 
            // 이미지 크기는 기존 디자인에 맞춰 32px 고정
            style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #3b82f6', objectFit: 'cover' }} 
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
        <input
          type="text"
          placeholder={placeholder}
          // [기존 UI 복구] 전달받은 style을 그대로 적용 (너비 무너짐 방지)
          style={{ ...style, width: '100%', boxSizing: 'border-box' }}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />
      </div>

      {isFocused && suggestions.length > 0 && (
        <ul style={{
          // [기존 UI 복구] 드롭다운 너비 확장 수치
          position: 'absolute', top: '115%', left: '-10%', width: '200%', zIndex: 9999,
          backgroundColor: '#1f2937', border: '2px solid #3b82f6', borderRadius: '12px',
          listStyle: 'none', padding: '6px 0', margin: 0, maxHeight: '300px', overflowY: 'auto',
          boxShadow: '0 15px 35px rgba(0,0,0,0.8)'
        }}>
          {suggestions.map((c, i) => (
            <li key={i} onClick={() => handleSelect(c)} style={{ 
              padding: '12px 16px', cursor: 'pointer', fontSize: '14px', color: 'white', 
              borderBottom: '1px solid #374151', display: 'flex', alignItems: 'center', gap: '12px'
            }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
               onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              <img src={getImgUrl(c.en)} alt="" style={{ width: '34px', height: '34px', borderRadius: '50%', border: '1px solid #4b5563', objectFit: 'cover' }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 'bold' }}>{c.ko}</span>
                <span style={{ color: '#9ca3af', fontSize: '11px' }}>{c.en}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// 메인 앱 컴포넌트
function App() {
  useEffect(() => {
    // 폰트 설정 복구
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700;900&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
  }, []);

  const [matchInfo, setMatchInfo] = useState({
    date: new Date().toISOString().split('T')[0],
    winTeam: 'Blue',
    duration: '',
    blueBans: Array(5).fill(null).map(() => ({ champ: '', target: 'ALL' })),
    redBans: Array(5).fill(null).map(() => ({ champ: '', target: 'ALL' }))
  });

  const [players, setPlayers] = useState(
    Array(10).fill(null).map((_, i) => ({
      nickname: '', side: i < 5 ? 'Blue' : 'Red',
      lane: ['TOP', 'JNG', 'MID', 'ADC', 'SUP'][i % 5],
      champion: '', k: '', d: '', a: '', damage: '', damage_taken: '', 
      gold: '', vision: '', control_wards: '', cs: '', multi_kill: '0', first_blood: false 
    }))
  );

  const handlePlayerChange = (index, field, value) => {
    const newPlayers = [...players];
    newPlayers[index] = { ...newPlayers[index], [field]: value };
    setPlayers(newPlayers);
  };

  const handleBanUpdate = (side, index, field, value) => {
    const banField = side === 'Blue' ? 'blueBans' : 'redBans';
    const newBans = [...matchInfo[banField]];
    newBans[index] = { ...newBans[index], [field]: value };
    setMatchInfo({ ...matchInfo, [banField]: newBans });
  };

  const handleSubmit = async () => {
    try {
      const { data: mData, error: mError } = await supabase.from('matches').insert([{ 
          match_date: matchInfo.date, win_team: matchInfo.winTeam, duration: matchInfo.duration,
          blue_bans: matchInfo.blueBans, red_bans: matchInfo.redBans
      }]).select();
      if (mError) throw mError;

      const statsToSave = players.map(p => ({
        match_id: mData[0].id, nickname: p.nickname, side: p.side, lane: p.lane, champion: p.champion,
        kills: Number(p.k), deaths: Number(p.d), assists: Number(p.a), damage: Number(p.damage),
        damage_taken: Number(p.damage_taken), gold: Number(p.gold), vision_score: Number(p.vision),
        control_wards: Number(p.control_wards), cs: Number(p.cs), multi_kill: Number(p.multi_kill), first_blood: p.first_blood
      }));

      await supabase.from('match_stats').insert(statsToSave);
      alert("🎉 데이터 저장이 완료되었습니다!");
    } catch (e) { alert("저장 실패"); }
  };

  // [기존 UI 복구] 핵심 스타일 수치 원복
  const cardStyle = { backgroundColor: '#111827', padding: '24px', borderRadius: '16px', marginBottom: '20px', border: '1px solid #1f2937' };
  const inputBaseStyle = { backgroundColor: '#1f2937', color: 'white', border: '1px solid #374151', padding: '8px 12px', borderRadius: '8px', outline: 'none', fontSize: '14px' };
  const banInputStyle = { ...inputBaseStyle, width: '100px', fontSize: '12px', padding: '6px' };
  const banSelectStyle = { ...inputBaseStyle, width: '100px', fontSize: '11px', padding: '5px', backgroundColor: '#374151', border: 'none' };

  return (
    <div style={{ backgroundColor: '#030712', color: '#f3f4f6', minHeight: '100vh', padding: '40px 30px', fontFamily: "'Noto Sans KR', sans-serif" }}>
      <div style={{ maxWidth: '1450px', margin: '0 auto' }}>
        <header style={{ marginBottom: '30px', textAlign: 'center' }}>
          <h1 style={{ color: '#60a5fa', fontSize: '40px', fontWeight: '900' }}>내전 데이터 기록</h1>
        </header>

        {/* 1. 경기 요약 섹션 */}
        <div style={cardStyle}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <input type="date" style={inputBaseStyle} value={matchInfo.date} onChange={e => setMatchInfo({...matchInfo, date: e.target.value})} />
            <select style={inputBaseStyle} value={matchInfo.winTeam} onChange={e => setMatchInfo({...matchInfo, winTeam: e.target.value})}>
              <option value="Blue">BLUE WIN</option><option value="Red">RED WIN</option>
            </select>
            <input type="text" style={inputBaseStyle} placeholder="게임 시간 (예: 25:30)" value={matchInfo.duration} onChange={e => setMatchInfo({...matchInfo, duration: e.target.value})} />
          </div>
        </div>

        {/* 2. 저격 밴 섹션 */}
        <div style={{ ...cardStyle, borderLeft: '4px solid #60a5fa' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {['Blue', 'Red'].map(side => (
              <div key={side} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
                <span style={{ fontSize: '13px', color: side === 'Blue' ? '#60a5fa' : '#f87171', fontWeight: 'bold', width: '80px' }}>{side.toUpperCase()} BANS</span>
                {matchInfo[`${side.toLowerCase()}Bans`].map((ban, idx) => (
                  <div key={`${side}-${idx}`} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {/* [기존 UI 복구] 밴 입력창 너비 고정 */}
                    <ChampionAutocomplete style={banInputStyle} placeholder="챔피언" value={ban.champ} onChange={(v) => handleBanUpdate(side, idx, 'champ', v)} />
                    <select style={banSelectStyle} value={ban.target} onChange={e => handleBanUpdate(side, idx, 'target', e.target.value)}>
                      <option value="ALL">공통</option><option value="TOP">TOP</option><option value="JNG">JNG</option><option value="MID">MID</option><option value="ADC">ADC</option><option value="SUP">SUP</option>
                    </select>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* 3. 플레이어 기록 테이블 섹션 (팀별 분리 버전) */}
        <div style={{ ...cardStyle, padding: '0', overflowX: 'auto', border: 'none' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1200px', backgroundColor: '#111827' }}>
            <thead>
              <tr style={{ backgroundColor: '#1f2937', color: '#9ca3af', fontSize: '13px' }}>
                <th style={{ padding: '20px 15px' }}>선수 / 챔피언</th>
                <th style={{ padding: '20px 15px' }}>K / D / A</th>
                <th style={{ padding: '20px 15px' }}>딜량 (가/받)</th>
                <th style={{ padding: '20px 15px' }}>성장 (골드/CS)</th>
                <th style={{ padding: '20px 15px' }}>시야 (점수/제어)</th>
                <th style={{ padding: '20px 40px 20px 15px', textAlign: 'center' }}>특수 기록</th>
              </tr>
            </thead>
            <tbody>
              {/* 블루팀과 레드팀을 나누어 렌더링 */}
              {['Blue', 'Red'].map((side) => (
                <React.Fragment key={side}>
                  {/* 팀 구분 헤더 행 */}
                  <tr style={{ backgroundColor: side === 'Blue' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(239, 68, 68, 0.1)' }}>
                    <td colSpan="6" style={{ padding: '12px 20px', borderLeft: `6px solid ${side === 'Blue' ? '#3b82f6' : '#ef4444'}`, fontWeight: '900', color: side === 'Blue' ? '#60a5fa' : '#f87171', fontSize: '15px' }}>
                      {side.toUpperCase()} TEAM
                    </td>
                  </tr>
                  {players
                    .map((p, originalIdx) => ({ ...p, originalIdx })) // 원본 인덱스 유지
                    .filter(p => p.side === side)
                    .map((p, i) => (
                      <tr key={p.originalIdx} style={{ borderBottom: '1px solid #1f2937' }}>
                        <td style={{ padding: '18px 15px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                            {/* 닉네임 입력란: 팀 컬러로 강조 */}
                            <input 
                              type="text" 
                              placeholder={`${p.lane} 닉네임`} 
                              style={{ ...inputBaseStyle, width: '125px', borderColor: side === 'Blue' ? '#3b82f6' : '#ef4444' }} 
                              value={p.nickname} 
                              onChange={e => handlePlayerChange(p.originalIdx, 'nickname', e.target.value)} 
                            />
                            <ChampionAutocomplete 
                              style={{ ...inputBaseStyle, width: '125px' }} 
                              placeholder="챔피언" 
                              value={p.champion} 
                              onChange={(v) => handlePlayerChange(p.originalIdx, 'champion', v)} 
                            />
                          </div>
                        </td>
                        <td style={{ padding: '18px 15px' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                            <input type="number" placeholder="K" style={{ ...inputBaseStyle, width: '48px', textAlign: 'center' }} value={p.k} onChange={e => handlePlayerChange(p.originalIdx, 'k', e.target.value)} />
                            <input type="number" placeholder="D" style={{ ...inputBaseStyle, width: '48px', textAlign: 'center' }} value={p.d} onChange={e => handlePlayerChange(p.originalIdx, 'd', e.target.value)} />
                            <input type="number" placeholder="A" style={{ ...inputBaseStyle, width: '48px', textAlign: 'center' }} value={p.a} onChange={e => handlePlayerChange(p.originalIdx, 'a', e.target.value)} />
                          </div>
                        </td>
                        <td style={{ padding: '18px 15px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                            <input type="number" placeholder="가한 딜" style={{ ...inputBaseStyle, width: '110px' }} value={p.damage} onChange={e => handlePlayerChange(p.originalIdx, 'damage', e.target.value)} />
                            <input type="number" placeholder="받은 피해" style={{ ...inputBaseStyle, width: '110px', borderColor: '#f87171' }} value={p.damage_taken} onChange={e => handlePlayerChange(p.originalIdx, 'damage_taken', e.target.value)} />
                          </div>
                        </td>
                        <td style={{ padding: '18px 15px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                            <input type="number" placeholder="골드" style={{ ...inputBaseStyle, width: '110px', color: '#facc15' }} value={p.gold} onChange={e => handlePlayerChange(p.originalIdx, 'gold', e.target.value)} />
                            <input type="number" placeholder="CS" style={{ ...inputBaseStyle, width: '110px' }} value={p.cs} onChange={e => handlePlayerChange(p.originalIdx, 'cs', e.target.value)} />
                          </div>
                        </td>
                        <td style={{ padding: '18px 15px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                            <input type="number" placeholder="시야" style={{ ...inputBaseStyle, width: '85px' }} value={p.vision} onChange={e => handlePlayerChange(p.originalIdx, 'vision', e.target.value)} />
                            <input type="number" placeholder="제어" style={{ ...inputBaseStyle, width: '85px', borderColor: '#fbbf24' }} value={p.control_wards} onChange={e => handlePlayerChange(p.originalIdx, 'control_wards', e.target.value)} />
                          </div>
                        </td>
                        <td style={{ padding: '18px 40px 18px 15px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                            <select style={{ ...inputBaseStyle, width: '115px', height: '40px' }} value={p.multi_kill} onChange={e => handlePlayerChange(p.originalIdx, 'multi_kill', e.target.value)}>
                              <option value="0">멀티킬 없음</option>
                              <option value="2">더블킬</option>
                              <option value="3">트리플킬</option>
                              <option value="4">쿼드라킬</option>
                              <option value="5">펜타킬</option>
                            </select>
                            <button 
                              onClick={() => handlePlayerChange(p.originalIdx, 'first_blood', !p.first_blood)} 
                              style={{ width: '115px', padding: '9px', borderRadius: '8px', border: '1px solid', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: p.first_blood ? '#ef4444' : '#1f2937', color: p.first_blood ? 'white' : '#9ca3af', borderColor: p.first_blood ? '#ef4444' : '#374151' }}
                            >
                              {p.first_blood ? 'FIRST BLOOD' : 'NO FB'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <button onClick={handleSubmit} style={{ width: '100%', padding: '22px', backgroundColor: '#2563eb', color: 'white', borderRadius: '16px', fontSize: '18px', fontWeight: '900', cursor: 'pointer', marginTop: '25px', border: 'none', boxShadow: '0 10px 25px rgba(37, 99, 235, 0.4)' }}>모든 데이터 세트 저장하기</button>
      </div>
    </div>
  );
}

export default App;
