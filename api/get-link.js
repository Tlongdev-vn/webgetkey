export default async function handler(req, res) {
    // Cho phép kết nối CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const { hwid } = req.query;
    const userHwid = hwid || "DEFAULT_DEVICE";

    // API Token Link4m của bạn
    const API_TOKEN = "68b3dda628184c43725cb671"; 
    
    // Tự động lấy domain Vercel hiện tại của bạn
    const host = req.headers.host;
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    
    // Tạo đường dẫn trang đích sau khi người dùng vượt link xong
    const destinationUrl = `${protocol}://${host}/?getkey=true&hwid=${userHwid}`;

    // Gọi API Link4m (Đã mã hóa URL chuẩn)
    const link4mApi = `https://link4m.co/api-shorten/v2?api=${API_TOKEN}&url=${encodeURIComponent(destinationUrl)}`;

    try {
        const response = await fetch(link4mApi);
        const data = await response.json();

        // Kiểm tra kết quả trả về từ Link4m
        if (data.status === "success" && data.shortenedUrl) {
            return res.json({ 
                status: "success", 
                shortenedUrl: data.shortenedUrl 
            });
        } else {
            return res.status(500).json({ 
                status: "error", 
                message: data.message || "Không thể lấy link từ Link4m" 
            });
        }
    } catch (error) {
        return res.status(500).json({ 
            status: "error", 
            message: "Lỗi kết nối Server API: " + error.message 
        });
    }
}
