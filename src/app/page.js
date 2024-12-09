'use client'
import { useState } from 'react';

export default function Home() {
  const [user, setUser] = useState(null);

  const handleLogin = (role) => {
    setUser({ role });
  };

  return (
    <div>
      {!user ? (
        <h1>登入
        <div className='login'>
          <button onClick={() => handleLogin('user')}>一般登入</button>
          <button onClick={() => handleLogin('admin')}>管理者登入</button>
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
  const isAdmin = user.role === 'admin';

  const handleEdit = (field, value) => {
    if (!selectedPerson) return;
    const newData = data.map((person) =>
      person.name === selectedPerson.name ? { ...person, [field]: value } : person
    );
    setData(newData);
    setSelectedPerson({ ...selectedPerson, [field]: value });
  };

  const handleExport = () => {
    const file = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download = 'office.json';
    link.click();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setData(JSON.parse(e.target.result));
    };
    reader.readAsText(file);
  };

  const handleLoadJson = (fileNumber) => {
    import(`../data/office${fileNumber}.json`).then((module) => setData(module.default));
  };

  return (
    <div>
      <h1>中壢地政事務所 座位表</h1>
      <div>
        <button onClick={() => handleLoadJson(1)}>一樓座位表</button>
        <button onClick={() => handleLoadJson(2)}>二樓座位表</button>
        <button onClick={() => handleLoadJson(3)}>三樓座位表</button>
        <button onClick={() => handleLoadJson(4)}>四樓座位表</button>
        <button onClick={() => handleLoadJson(6)}>六樓座位表</button>
      </div>
      {isAdmin && (
        <div>
          <button onClick={handleExport}>輸出檔案</button>
          <input type="file" accept=".json" onChange={handleImport} />
        </div>
      )}
      <div className="grid">
        {data.map((person, index) => (
          <div
            key={index}
            className="seat"
            style={{ position: 'absolute', top: person.top, left: person.left }}
            onClick={() => setSelectedPerson(person)}
          >
            <p>{person.name}</p>
          </div>
        ))}
      </div>
      {selectedPerson && (
        <div className="details">
          <h2>同仁資訊：</h2>
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
                  placeholder="輸入科室"
                  type="text"
                  value={selectedPerson.department}
                  onChange={(e) => handleEdit('department', e.target.value)}
                />
              </label>
              <br/>
              <label>
                職責：
                <input
                  placeholder="輸入工作內容"
                  type="text"
                  value={selectedPerson.task}
                  onChange={(e) => handleEdit('task', e.target.value)}
                />
              </label>
            </div>
          ) : (
            <div>
              <p>名稱：{selectedPerson.name}</p>
              <p>分機：{selectedPerson.extension}</p>
              <p>科室：{selectedPerson.department}</p>
              <p>職責：{selectedPerson.task}</p>
            </div>
          )}
          <button onClick={() => setSelectedPerson(null)}>關閉</button>
        </div>
      )}s
    </div>
  );
}
