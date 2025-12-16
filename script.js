// Sẽ thêm config ở bước sau
const firebaseConfig = {
	  apiKey: "AIzaSyBYIYexQS5XY4E8KkMooYk00PmyIlp8j3c",
	  authDomain: "qlbh97.firebaseapp.com",
	  projectId: "qlbh97",
	  storageBucket: "qlbh97.firebasestorage.app",
	  messagingSenderId: "1016546325342",
	  appId: "1:1016546325342:web:7f2912754acc20858255cf",
	  measurementId: "G-0BPWFL4RT8"
};

// Khởi tạo Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Hàm đăng ký (lần đầu)
function signUp() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    auth.createUserWithEmailAndPassword(email, password)
        .then(user => {
            document.getElementById('message').textContent = 'Đăng ký thành công!';
        })
        .catch(err => {
            document.getElementById('message').textContent = err.message;
        });
}

// Hàm đăng nhập
function signIn() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
	if (!email || !password) {
        document.getElementById('message').textContent = 'Vui lòng nhập đầy đủ email và mật khẩu!';
        return;  // Dừng lại, không gọi Firebase
    }
    auth.signInWithEmailAndPassword(email, password)
        .then(user => {
            showDashboard();
        })
        .catch(err => {
            document.getElementById('message').textContent = 'Email hoặc mật khẩu không đúng!';
        });
}

// Hàm đăng nhập Google (nếu enable)
async function googleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        const result = await auth.signInWithPopup(provider);
        const user = result.user;
        const email = user.email.toLowerCase(); // Chuẩn hóa chữ thường

        // Kiểm tra allowed admins
        const configRef = db.collection('config').doc('allowedAdmins');
        const doc = await configRef.get();
        const allowedEmails = doc.exists && doc.data() && doc.data().emails ? doc.data().emails.map(e => typeof e === 'string' ? e.toLowerCase() : '') : [];

        if (!allowedEmails.includes(email)) {
            await auth.signOut(); // Đăng xuất ngay lập tức
            document.getElementById('message').textContent = 'Bạn không có quyền đăng nhập bằng Google!';
            return; // Dừng hàm, không vào dashboard
        }

        // Cho phép → Tạo/cập nhật shop riêng
        await db.collection('users').doc(user.uid).set({
            uid: user.uid,
            email: email,
            displayName: user.displayName || email.split('@')[0],
            role: 'admin',
            shopId: user.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        currentRole = 'admin';
        showDashboard();
    } catch (error) {
        document.getElementById('message').textContent = 'Lỗi Google login: ' + error.message;
    }
}

// Hiển thị dashboard khi login thành công
function showDashboard() {
    document.querySelector('.login-container').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
}

// Đăng xuất
function signOut() {
    auth.signOut().then(() => location.reload());
}

/* Sidebar với avatar */
.sidebar {
    width: 80px;
    background: #2d1b69; /* Tím đen như hình */
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 4px 0 10px rgba(0,0,0,0.2);
    border-radius: 0 20px 20px 0; /* Bo tròn góc phải */
    z-index: 1000;
    padding-top: 20px;
}

.sidebar-avatar {
    margin-bottom: 40px;
}

.avatar-img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid white;
}

.sidebar-nav ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 30px;
    flex: 1;
    justify-content: flex-start;
    width: 100%;
    align-items: center;
}

.sidebar-item {
    color: white;
    font-size: 24px;
    cursor: pointer;
    padding: 12px;
    border-radius: 12px;
    transition: background 0.3s;
    position: relative;
}

.sidebar-item:hover {
    background: #4c1d95; /* Tím nhạt hover như hình */
}

.sidebar-item.active {
    background: #4c1d95;
}

.sidebar-logout {
    margin-top: auto;
    margin-bottom: 30px;
}

/* Tooltip hover icon */
.sidebar-item::after {
    content: attr(title);
    position: absolute;
    left: 90px;
    top: 50%;
    transform: translateY(-50%);
    background: #333;
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 14px;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
}

.sidebar-item:hover::after {
    opacity: 1;
}

/* Content điều chỉnh để tránh sidebar */
.content {
    margin-left: 80px; /* Width sidebar */
    padding: 20px;
    background: #fff;
    min-height: 100vh;
}









