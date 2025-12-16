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
// Load avatar và info user khi login thành công
function loadUserInfo(user) {
    // Load avatar từ Google
    const avatarImg = document.getElementById('user-avatar-img');
    if (user.photoURL) {
        avatarImg.src = user.photoURL; // Ảnh Google
    } else {
        avatarImg.src = 'asset/default-avatar.png'; // Ảnh default nếu không có (ba thêm file này vào asset nếu muốn)
    }

    // Load tên và email (nếu ba muốn hiện ở dropdown hoặc chỗ khác)
    document.getElementById('user-name').textContent = user.displayName || user.email.split('@')[0];
    document.getElementById('user-email').textContent = user.email;
}

// Gọi hàm này trong onAuthStateChanged hoặc sau khi login thành công
auth.onAuthStateChanged(user => {
    if (user) {
        loadUserInfo(user); // Load avatar + info
        showDashboard();
    }
});











