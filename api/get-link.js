export default async function handler(req, res) {
    // Cho phép gọi API từ Frontend
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const { hwid } = req.query;
    if (!hwid) {
        return res.status(400).json({ status: "error", message: "Thiếu thông tin thiết bị (HWID)" });
    }

    // API Token Link4m của bạn
    const API_TOKEN = "68b3dda628184c43725cb671"; 
    
    // Trang đích trả về khi khách vượt link thành công
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers.host;
    const destinationUrl = `${protocol}://${host}/?getkey=true&hwid=${encodeURIComponent(hwid)}`;

    // Gọi API Link4m rút gọn link
    const link4mApi = `https://link4m.co/api-shorten/v2?api=${API_TOKEN}&url=${encodeURIComponent(destinationUrl)}`;

    try {
        const response = await fetch(link4mApi);
        const data = await response.json();

        if (data.status === "success") {
            return res.json({ status: "success", shortenedUrl: data.shortenedUrl });
        } else {
            return res.status(500).json({ status: "error", message: data.message || "Không thể tạo link Link4m" });
        }
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
}
