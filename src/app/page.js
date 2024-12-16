'use client'
import { useCheckLogin } from '@/utils/useCheckLogin.js';
import { useContext, useEffect, useState } from 'react';
import * as XLSX from "xlsx/xlsx";
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthProvider';
import { AuthProvider } from '@/context/AuthProvider';

export default function Home() {
  return (
          <HomePage />
  );
}

function HomePage() {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [user, setUser] = useState(null);
  const verified = useCheckLogin();
  const router = useRouter();

  useEffect(() => {
    fetch('/api/verifyLogin')
        .then(res => {
            return res.json();
        })
        .then(({ valid, username, isManager }) => {
            setIsAuthChecked(true);

            if (valid) {
                setAuth(username);
                setIsManager(isManager);
            }
        })
}, [])

  const [ auth, setAuth, isManager, setIsManager ] = useContext(AuthContext);

  const handleLogin = (role) => {
    setUser({ role });
  };

  return (
    <div>
      {!user ? (
        <h1>選擇權限頁面
        <div className='login'>
          <button onClick={() => handleLogin('user')} className="other-button">一般登入</button>
          <button onClick={() => handleLogin('admin')} className="other-button">管理者登入</button>
        </div>
        </h1>
      ) : (
        <OfficeLayout user={user} />
      )}
    </div>
  );
}

function OfficeLayout({ user }) {
  const [data, setData] = useState(require('../data/office1.json'));
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [swapMode, setSwapMode] = useState(false);
  const [swapCandidates, setSwapCandidates] = useState([]);
  const [swapFields, setSwapFields] = useState({
    name: true,
//    extension: true,
    department: true,
    task: true,
//    hbweb: true,
//    hbland: true,
//    monitor1: true,
//    monitor2: true,
  });
  const isAdmin = user.role === 'admin';

  //交換模式
  const handleSwapClick = () => {
    if(swapMode){// 如果已經在交換模式，再次按下退出模式
      setSwapMode(false);
      setSwapCandidates([]);
    }
    else{
      setSwapMode(true);
      setSwapCandidates([]);
    }
  };

  //處理點擊，判斷是否為交換模式，以及是交換模式的第一下或是第二下
  const handleSeatClick = (person) => {
    if (swapMode) {
      const newCandidates = [...swapCandidates, person];
      if (newCandidates.length === 2) {
        swapData(newCandidates[0], newCandidates[1]);
        setSwapMode(false);
      } else {
        setSwapCandidates(newCandidates);
      }
    } else {
      setSelectedPerson(person);
    }
  };

  //確認有無打勾
  const handleFieldChange = (field) => {
    setSwapFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  //交換
  const swapData = (person1, person2) => {
    const updatedData = data.map((person) => {
      if (person === person1) {
        return {
          ...person,
          ...(swapFields.name && { name: person2.name }),
          ...(swapFields.extension && { extension: person2.extension }),
          ...(swapFields.department && { department: person2.department }),
          ...(swapFields.task && { task: person2.task }),
          ...(swapFields.hbweb && { hbweb: person2.hbweb }),
          ...(swapFields.hbland && { hbland: person2.hbland }),
          ...(swapFields.monitor1 && { monitor1: person2.monitor1 }),
          ...(swapFields.monitor2 && { monitor2: person2.monitor2 }),
        };
      }
      if (person === person2) {
        return {
          ...person,
          ...(swapFields.name && { name: person1.name }),
          ...(swapFields.extension && { extension: person1.extension }),
          ...(swapFields.department && { department: person1.department }),
          ...(swapFields.task && { task: person1.task }),
          ...(swapFields.hbweb && { hbweb: person1.hbweb }),
          ...(swapFields.hbland && { hbland: person1.hbland }),
          ...(swapFields.monitor1 && { monitor1: person1.monitor1 }),
          ...(swapFields.monitor2 && { monitor2: person1.monitor2 }),
        };
      }
      return person;
    });
    setData(updatedData);
    setSwapCandidates([]);
  };

  //將現有頁面輸出成Excel
  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'OfficeData');
    XLSX.writeFile(workbook, 'office_data.xlsx');
  };

  //將excel輸入更改成json的形式並在頁面上呈現
  const handleImportFromExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const binary = e.target.result;
      const workbook = XLSX.read(binary, { type: 'binary' });
      const sheetName = workbook.SheetNames[0]; //only read the first worksheet
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet);

      //update
      setData(json);
    };
    reader.readAsBinaryString(file);
  };

  //更改文字時動態變更頁面
  const handleEdit = (field, value) => {
    if (!selectedPerson) return;
    clearInputFile();
    const newData = data.map((person) =>
      //以座位的index判斷要改變哪個座位的資料
      person.index === selectedPerson.index ? { ...person, [field]: value } : person
    );
    setData(newData);
    setSelectedPerson({ ...selectedPerson, [field]: value });
  };

  //將現有頁面輸出成json
  const handleExport = () => {
    const file = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download = 'office.json';
    link.click();
  };

  //將json輸入並在頁面上呈現
  const handleImport = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setData(JSON.parse(e.target.result));
    };
    reader.readAsText(file);
  };

  //切換json
  const handleLoadJson = (fileNumber) => {
    import(`../data/office${fileNumber}.json`).then((module) => setData(module.default));
    setSelectedPerson(null);
    clearInputFile();
  };

  //清除檔案
  function clearInputFile(){
    if(isAdmin)//非管理者沒有上傳檔案的選項，不須清除
    document.getElementById('input_file').value= null;
  };

  //藉由刷新頁面回到上一頁
  const ruturnBack= (event) => {
        location.reload();
      };

  //登出
  const onSignoutClicked= (event) => {
    fetch('/api/logout').then(res => res.json())
        .then(() => {
            setAuth('');
            router.push('/login');
        })
        console.log("user logout!");
        location.reload();//重新整理 我作弊==
      };

  return (
    <div>
      <h1>中壢地政事務所 座位表</h1>
      <ul>
        <li onClick={() => handleLoadJson(1)} className="switch-seat-button" style={{top: "10vh"}}>一樓座位表</li>
        <li onClick={() => handleLoadJson(2)} className="switch-seat-button" style={{top: "22vh"}}>二樓座位表</li>
        <li onClick={() => handleLoadJson(3)} className="switch-seat-button" style={{top: "33vh"}}>三樓座位表</li>
        <li onClick={() => handleLoadJson(4)} className="switch-seat-button" style={{top: "44vh"}}>四樓座位表</li>
        <li onClick={() => handleLoadJson(6)} className="switch-seat-button" style={{top: "55vh"}}>六樓座位表</li>
        <li onClick={ ruturnBack } className="switch-seat-button" style={{top: "71vh"}}>回上一頁</li>
        <li onClick={ onSignoutClicked } className="switch-seat-button" style={{top: "82vh"}}>登出</li>
      </ul>
      {isAdmin && (
        <div className="switch-group">
          {/*
          <button onClick={handleExport} className="other-button">
            <span className="icon export-icon"></span>生成程式檔
          </button>
          <label className="other-button">
          <input type="file" accept=".json" className="input-file-button" onChange={handleImport} id="input_file" />
          <span className="icon upload-icon"></span>
          <p className="text-middle">上傳Json檔</p>
          </label>
          */}
          <button onClick={handleExportToExcel} className="other-button">
            生成Excel
            </button>
          <label className="other-button">
            <input type="file" accept=".xlsx" className="input-file-button" onChange={handleImportFromExcel} id="input_file" />
            <p className="text-middle">上傳Excel</p>
          </label>
          <button onClick={handleSwapClick} className="other-button">
            交換座位
          </button>
        </div>
      )}
      <div className="grid">
        {data.map((person, index) => (
          <div
            key={index}
            className={`seat ${swapMode ? 'swap-mode' : ''} ${
              swapCandidates.includes(person) ? 'swap-selected' : ''
            }`}
            style={{ position: 'absolute', top: person.top, left: person.left }}
            onClick={() => handleSeatClick(person)}
          >
            <p>{person.name}</p>
          </div>
        ))}
      </div>
      {swapMode && (
        <div className="swap-options">
          <h3>交換項目</h3>
          <label>
            <input
              type="checkbox"
              checked={swapFields.name}
              onChange={() => handleFieldChange('name')}
            />
            姓名
          </label>
          <label>
            <input
              type="checkbox"
              checked={swapFields.extension}
              onChange={() => handleFieldChange('extension')}
            />
            分機
          </label>
          <label>
            <input
              type="checkbox"
              checked={swapFields.department}
              onChange={() => handleFieldChange('department')}
            />
            科室
          </label>
          <label>
            <input
              type="checkbox"
              checked={swapFields.task}
              onChange={() => handleFieldChange('task')}
            />
            工作內容
          </label>
          <label>
            <input
              type="checkbox"
              checked={swapFields.hbweb}
              onChange={() => handleFieldChange('hbweb')}
            />
            內網電腦
          </label>
          <label>
            <input
              type="checkbox"
              checked={swapFields.hbland}
              onChange={() => handleFieldChange('hbland')}
            />
            外網電腦
          </label>
          <label>
            <input
              type="checkbox"
              checked={swapFields.monitor1}
              onChange={() => handleFieldChange('monitor1')}
            />
            螢幕
          </label>
          <label>
            <input
              type="checkbox"
              checked={swapFields.monitor2}
              onChange={() => handleFieldChange('monitor2')}
            />
            螢幕
          </label>
        </div>
      )}
      {selectedPerson && (
        <div className="details">
          <h2>資訊：</h2>
          {isAdmin ? (
            <div>
              <label>
                姓名：
                <input
                  placeholder="輸入姓名"
                  type="text"
                  value={selectedPerson.name}
                  onChange={(e) => handleEdit('name', e.target.value)}
                />
              </label>
              <br/>
              <label>
                分機：
                <input
                  placeholder="輸入分機"
                  type="text"
                  value={selectedPerson.extension}
                  onChange={(e) => handleEdit('extension', e.target.value)}
                />
              </label>
              <br/>
              <label>
                科室：
                <input
                  placeholder="輸入課室"
                  type="text"
                  value={selectedPerson.department}
                  onChange={(e) => handleEdit('department', e.target.value)}
                />
              </label>
              <br/>
              <label>
                工作內容：
                <input
                  placeholder="輸入工作內容"
                  type="text"
                  value={selectedPerson.task}
                  onChange={(e) => handleEdit('task', e.target.value)}
                />
              </label>
              <br/>
              <label>
                內網電腦：
                <input
                  placeholder="輸入內網電腦財產編號"
                  type="text"
                  value={selectedPerson.hbweb}
                  onChange={(e) => handleEdit('hbweb', e.target.value)}
                />
              </label>
              <br/>
              <label>
                外網電腦：
                <input
                  placeholder="輸入外網電腦財產編號"
                  type="text"
                  value={selectedPerson.hbland}
                  onChange={(e) => handleEdit('hbland', e.target.value)}
                />
              </label>
              <br/>
              <label>
                螢幕：
                <input
                  placeholder="輸入螢幕財產編號"
                  type="text"
                  value={selectedPerson.monitor1}
                  onChange={(e) => handleEdit('monitor1', e.target.value)}
                />
              </label>
              <br/>
              <label>
                螢幕：
                <input
                  placeholder="輸入第二台螢幕財產編號"
                  type="text"
                  value={selectedPerson.monitor2}
                  onChange={(e) => handleEdit('monitor2', e.target.value)}
                />
              </label>
            </div>
          ) : (
            <div>
              {selectedPerson.name &&(
                <p>名稱：{selectedPerson.name}</p>
              )}
              {selectedPerson.extension &&(
                <p>分機：{selectedPerson.extension}</p>
              )}
              {selectedPerson.department &&(
                <p>課室：{selectedPerson.department}</p>
              )}
              {selectedPerson.task &&(
                <p>工作內容：{selectedPerson.task}</p>
              )}
              {selectedPerson.hbweb &&(
                <p>內網主機：{selectedPerson.hbweb}</p>
              )}
              {selectedPerson.hbland &&(
                <p>外網主機：{selectedPerson.hbland}</p>
              )}
              {selectedPerson.monitor1 &&(
                <p>螢幕：{selectedPerson.monitor1}</p>
              )}
              {selectedPerson.monitor1 &&(
                <p>螢幕：{selectedPerson.monitor2}</p>
              )}
            </div>
          )}
          <button onClick={() => setSelectedPerson(null)} className="other-button">關閉</button>
        </div>
      )}
    </div>
  );
}
