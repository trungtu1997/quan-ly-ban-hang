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
function googleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then(user => showDashboard())
        .catch(err => document.getElementById('message').textContent = err.message);
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

// Kiểm tra trạng thái login khi load page
auth.onAuthStateChanged(user => {
    if (user) {
        showDashboard();
    }

});

