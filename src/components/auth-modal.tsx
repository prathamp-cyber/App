import React, { useState } from 'react';
import { Modal, StyleSheet, View, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { useAuth, UserRole } from '@/context/AuthContext';
import { Spacing } from '@/constants/theme';

export function AuthModal() {
  const theme = useTheme();
  const { isAuthModalVisible, setAuthModalVisible, login, signup, quickDemoLogin } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<UserRole>('client');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [firmName, setFirmName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const green = theme.primaryGreen;
  const brown = theme.primaryBrown;

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setPhone('');
    setFirmName('');
    setErrorMessage('');
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    setAuthModalVisible(false);
  };

  const handleSubmit = async () => {
    setErrorMessage('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (!res.success) {
          setErrorMessage(res.error || 'Failed to sign in.');
        } else {
          resetForm();
        }
      } else {
        const res = await signup({
          name,
          email,
          password,
          role,
          phone,
          firmName: role === 'designer' ? firmName : undefined,
        });
        if (!res.success) {
          setErrorMessage(res.error || 'Failed to create account.');
        } else {
          resetForm();
        }
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={isAuthModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={handleClose} />

        <View style={[styles.card, { backgroundColor: theme.background, borderColor: theme.border }]}>
          {/* Header Bar */}
          <View style={styles.header}>
            <View>
              <ThemedText type="smallBold" style={[styles.brandLabel, { color: brown }]}>
                DWELLIST MEMBER AUTH
              </ThemedText>
              <ThemedText type="subtitle" style={[styles.title, { color: green }]}>
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </ThemedText>
            </View>
            <Pressable onPress={handleClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={theme.text} />
            </Pressable>
          </View>

          {/* Mode Switcher Tabs */}
          <View style={[styles.tabRow, { backgroundColor: theme.backgroundElement }]}>
            <Pressable
              onPress={() => { setMode('login'); setErrorMessage(''); }}
              style={[
                styles.tab,
                mode === 'login' && { backgroundColor: theme.cardBackground, borderColor: theme.border, borderWidth: 1 }
              ]}
            >
              <ThemedText
                type="smallBold"
                style={{ color: mode === 'login' ? green : theme.textSecondary, fontSize: 13 }}
              >
                Sign In
              </ThemedText>
            </Pressable>
            <Pressable
              onPress={() => { setMode('signup'); setErrorMessage(''); }}
              style={[
                styles.tab,
                mode === 'signup' && { backgroundColor: theme.cardBackground, borderColor: theme.border, borderWidth: 1 }
              ]}
            >
              <ThemedText
                type="smallBold"
                style={{ color: mode === 'signup' ? green : theme.textSecondary, fontSize: 13 }}
              >
                Sign Up
              </ThemedText>
            </Pressable>
          </View>

          {/* Error Banner */}
          {errorMessage !== '' && (
            <View style={[styles.errorBanner, { backgroundColor: '#FDEDEC', borderColor: '#F5C6CB' }]}>
              <Ionicons name="alert-circle" size={16} color="#C0392B" />
              <ThemedText style={{ color: '#C0392B', fontSize: 12, flex: 1, fontWeight: '600' }}>
                {errorMessage}
              </ThemedText>
            </View>
          )}

          {/* Account Role Selector for Sign Up */}
          {mode === 'signup' && (
            <View style={styles.roleContainer}>
              <ThemedText style={styles.inputLabel} themeColor="textSecondary">
                Account Type
              </ThemedText>
              <View style={styles.roleRow}>
                <Pressable
                  onPress={() => setRole('client')}
                  style={[
                    styles.roleChip,
                    {
                      borderColor: role === 'client' ? green : theme.border,
                      backgroundColor: role === 'client' ? theme.accentGreenLight : 'transparent'
                    }
                  ]}
                >
                  <Ionicons name="person" size={14} color={role === 'client' ? green : theme.textSecondary} />
                  <ThemedText
                    type="smallBold"
                    style={{ fontSize: 12, color: role === 'client' ? green : theme.textSecondary }}
                  >
                    Homeowner
                  </ThemedText>
                </Pressable>

                <Pressable
                  onPress={() => setRole('designer')}
                  style={[
                    styles.roleChip,
                    {
                      borderColor: role === 'designer' ? brown : theme.border,
                      backgroundColor: role === 'designer' ? theme.accentBrownLight : 'transparent'
                    }
                  ]}
                >
                  <Ionicons name="briefcase" size={14} color={role === 'designer' ? brown : theme.textSecondary} />
                  <ThemedText
                    type="smallBold"
                    style={{ fontSize: 12, color: role === 'designer' ? brown : theme.textSecondary }}
                  >
                    Designer / Firm
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          )}

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {mode === 'signup' && (
              <View>
                <ThemedText style={styles.inputLabel} themeColor="textSecondary">Full Name</ThemedText>
                <TextInput
                  style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.inputBackground }]}
                  placeholder="e.g. Darshan Vora"
                  placeholderTextColor={theme.textSecondary}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            )}

            <View>
              <ThemedText style={styles.inputLabel} themeColor="textSecondary">Email Address</ThemedText>
              <TextInput
                style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.inputBackground }]}
                placeholder="e.g. darshan@example.com"
                placeholderTextColor={theme.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View>
              <ThemedText style={styles.inputLabel} themeColor="textSecondary">Password</ThemedText>
              <View style={[styles.passwordWrapper, { borderColor: theme.border, backgroundColor: theme.inputBackground }]}>
                <TextInput
                  style={[styles.passwordInput, { color: theme.text }]}
                  placeholder="••••••••"
                  placeholderTextColor={theme.textSecondary}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={18}
                    color={theme.textSecondary}
                  />
                </Pressable>
              </View>
            </View>

            {mode === 'signup' && (
              <>
                <View>
                  <ThemedText style={styles.inputLabel} themeColor="textSecondary">Mobile Number (Optional)</ThemedText>
                  <TextInput
                    style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.inputBackground }]}
                    placeholder="+91 98250 00000"
                    placeholderTextColor={theme.textSecondary}
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                  />
                </View>

                {role === 'designer' && (
                  <View>
                    <ThemedText style={styles.inputLabel} themeColor="textSecondary">Studio / Firm Name</ThemedText>
                    <TextInput
                      style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.inputBackground }]}
                      placeholder="e.g. Studio Form & Space"
                      placeholderTextColor={theme.textSecondary}
                      value={firmName}
                      onChangeText={setFirmName}
                    />
                  </View>
                )}
              </>
            )}

            {/* Submit Button */}
            <Pressable
              onPress={handleSubmit}
              disabled={loading}
              style={({ pressed }) => [
                styles.submitBtn,
                { backgroundColor: green },
                pressed && { opacity: 0.9 }
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <ThemedText type="smallBold" style={{ color: '#FFFFFF', fontSize: 15 }}>
                  {mode === 'login' ? 'Sign In to Dwellist' : 'Create Account'}
                </ThemedText>
              )}
            </Pressable>
          </View>

          {/* Quick Demo Login Options */}
          <View style={[styles.demoContainer, { borderTopColor: theme.border }]}>
            <ThemedText style={styles.demoTitle} themeColor="textSecondary">
              QUICK TESTING DEMO LOGINS
            </ThemedText>

            <View style={styles.demoButtonsRow}>
              <Pressable
                onPress={() => quickDemoLogin('client')}
                style={({ pressed }) => [
                  styles.demoBtn,
                  { borderColor: theme.border, backgroundColor: theme.accentGreenLight },
                  pressed && { opacity: 0.8 }
                ]}
              >
                <Ionicons name="person-circle" size={16} color={green} />
                <ThemedText style={{ color: green, fontSize: 11, fontWeight: '700' }}>
                  Demo Client
                </ThemedText>
              </Pressable>

              <Pressable
                onPress={() => quickDemoLogin('designer')}
                style={({ pressed }) => [
                  styles.demoBtn,
                  { borderColor: theme.border, backgroundColor: theme.accentBrownLight },
                  pressed && { opacity: 0.8 }
                ]}
              >
                <Ionicons name="business" size={16} color={brown} />
                <ThemedText style={{ color: brown, fontSize: 11, fontWeight: '700' }}>
                  Demo Designer
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.three,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 18,
    borderWidth: 1,
    padding: Spacing.four,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.three,
  },
  brandLabel: {
    fontSize: 9,
    letterSpacing: 1.5,
    fontWeight: '800',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
  },
  tabRow: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 10,
    marginBottom: Spacing.three,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: Spacing.three,
  },
  roleContainer: {
    marginBottom: Spacing.three,
  },
  roleRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  roleChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  formContainer: {
    gap: 12,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
  },
  eyeIcon: {
    padding: 6,
  },
  submitBtn: {
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: '#1E3F20',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  demoContainer: {
    marginTop: Spacing.four,
    paddingTop: Spacing.three,
    borderTopWidth: 1,
  },
  demoTitle: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 10,
    textAlign: 'center',
  },
  demoButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  demoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
});
