import { useEffect, useState } from "react";
import { getHistory } from "../services/historyService";

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getHistory()
      .then((res) => setHistory(res.data))
      .catch(() => alert("Không lấy được lịch sử"));
  }, []);

  return (
    <div>
      <h2>Lịch sử nhận diện</h2>

      {history.length === 0 ? (
        <p>Chưa có dữ liệu</p>
      ) : (
        <table border="1" width="100%">
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Tên biển báo</th>
              <th>Độ tin cậy</th>
              <th>Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, index) => (
              <tr key={index}>
                <td>
                  <img src={item.image_url} width="120" />
                </td>
                <td>{item.sign_name}</td>
                <td>{item.confidence}%</td>
                <td>{item.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default History;
