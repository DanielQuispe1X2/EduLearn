// =====================================
// CONFIGURACIÓN SUPABASE
// =====================================

const SUPABASE_URL = "https://cuxkdaelopujuqkqomys.supabase.co";

const SUPABASE_ANON_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1eGtkYWVsb3B1anVxa3FvbXlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2MTcyOTMsImV4cCI6MjA3ODE5MzI5M30.h2PNyPODTGJH2H7lNG00RGeTZXOCUwOXPON-t61yrps";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// =====================================
//   VARIABLES DE ESTADO
// =====================================
let mode = "login"; // login | register

const title = document.getElementById("formTitle");
const subtitle = document.getElementById("formSubtitle");
const submitBtn = document.getElementById("submitBtn");
const toggleText = document.getElementById("toggleText");
const toggleMode = document.getElementById("toggleMode");
const nameGroup = document.getElementById("nameGroup");

// =====================================
// CAMBIO LOGIN <-> REGISTRO
// =====================================

toggleMode.addEventListener("click", () => {
    if (mode === "login") {
        mode = "register";
        title.textContent = "Crear una cuenta";
        subtitle.textContent = "Regístrate para comenzar a aprender";
        submitBtn.textContent = "Registrarme";
        toggleText.textContent = "¿Ya tienes cuenta?";
        toggleMode.textContent = "Inicia sesión";
        nameGroup.style.display = "block";
    } else {
        mode = "login";
        title.textContent = "Bienvenido de nuevo";
        subtitle.textContent = "Ingresa a tu cuenta para continuar aprendiendo";
        submitBtn.textContent = "Iniciar sesión";
        toggleText.textContent = "¿No tienes cuenta?";
        toggleMode.textContent = "Regístrate gratis";
        nameGroup.style.display = "none";
    }
});

// =====================================
// LOGIN + REGISTRO
// =====================================

document.getElementById("authForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const fullName = document.getElementById("fullName").value.trim();

    if (!email || !password) {
        alert("Debes llenar todos los campos obligatorios.");
        return;
    }

    if (mode === "register") {
        // =====================================
        // REGISTRO REAL SUPABASE
        // =====================================
        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password
        });

        if (error) {
            alert("❌ Error: " + error.message);
            return;
        }

        // Guardar perfil en tabla PROFILES
        await supabaseClient.from("profiles").insert([
            {
                id: data.user.id,
                full_name: fullName,
                role: "student"
            }
        ]);

        alert("✅ Cuenta creada correctamente. Ahora inicia sesión.");

        // Cambiar a modo login
        toggleMode.click();

    } else {
        // =====================================
        // LOGIN REAL SUPABASE
        // =====================================
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            alert("❌ Error: " + error.message);
            return;
        }

        alert("✅ Inicio de sesión exitoso!");
        window.location.href = "main.html";
    }
});
