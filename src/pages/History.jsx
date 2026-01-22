import { useEffect, useState } from "react";
import "./History.css";

export default function History() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/recognition/history/")
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="loading">Đang tải dữ liệu...</p>;

  return (
    <div className="history-page">
      <h2>Lịch sử nhận diện</h2>

      {data.map((item) => (
        <div key={item.id} className="history-card">
          <div className="history-header">
            <span>ID: {item.id}</span>
            <span>{new Date(item.created_at).toLocaleString()}</span>
          </div>

          <div className="history-body">
            <p><b>Loại file:</b> {item.file_type}</p>
            <p><b>Trạng thái:</b> {item.status}</p>

            {item.file_type === "video" && (
              <>
                <p><b>FPS:</b> {item.fps?.toFixed(2)}</p>
                <p><b>Thời lượng:</b> {item.duration?.toFixed(2)} s</p>
              </>
            )}

            <a href={item.output_file} target="_blank" rel="noreferrer">
              Xem kết quả
            </a>

            <div className="signs">
              <h4>Biển báo nhận diện</h4>
              {Object.entries(item.signs_summary).map(
                ([name, value]) => (
                  <div key={name} className="sign-item">
                    <span>{name}</span>
                    <span>Số lần: {value.count}</span>
                    <span>Độ tin cậy: {(value.avg_confidence * 100).toFixed(1)}%</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
