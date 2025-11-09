const RegisterScreen = ({ onNavigateToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    edad: '',
    telefono: '',
    biografia: '',
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = () => {
    // Validaciones básicas
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    console.log('Datos de registro:', formData);
    // Aquí irá la lógica de registro
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={onNavigateToLogin}
      >
        <Ionicons name="arrow-back" size={24} color="#7B68EE" />
        <Text style={styles.backText}>Volver al Login</Text>
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <ComeBackLogo size="small" />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.welcomeText}>Crear Cuenta Nueva</Text>
        <Text style={styles.subtitleText}>Únete a nuestra comunidad</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre"
          placeholderTextColor="#999"
          value={formData.firstName}
          onChangeText={(value) => updateField('firstName', value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Apellido"
          placeholderTextColor="#999"
          value={formData.lastName}
          onChangeText={(value) => updateField('lastName', value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Nombre de usuario"
          placeholderTextColor="#999"
          value={formData.username}
          onChangeText={(value) => updateField('username', value)}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={formData.email}
          onChangeText={(value) => updateField('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          placeholderTextColor="#999"
          value={formData.telefono}
          onChangeText={(value) => updateField('telefono', value)}
          keyboardType="phone-pad"
        />

        <TextInput
          style={styles.input}
          placeholder="Edad"
          placeholderTextColor="#999"
          value={formData.edad}
          onChangeText={(value) => updateField('edad', value)}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#999"
          value={formData.password}
          onChangeText={(value) => updateField('password', value)}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Confirmar contraseña"
          placeholderTextColor="#999"
          value={formData.confirmPassword}
          onChangeText={(value) => updateField('confirmPassword', value)}
          secureTextEntry
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Biografía (opcional)"
          placeholderTextColor="#999"
          value={formData.biografia}
          onChangeText={(value) => updateField('biografia', value)}
          multiline
          numberOfLines={3}
          maxLength={300}
        />

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleRegister}
        >
          <Text style={styles.loginButtonText}>Crear Cuenta</Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>¿Ya tienes cuenta? </Text>
          <TouchableOpacity onPress={onNavigateToLogin}>
            <Text style={styles.registerLink}>Inicia Sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};