import React, { useState, useEffect } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Designer } from '@/types/designer';

interface DesignerProfileFormModalProps {
  visible: boolean;
  designer: Designer | null;
  onClose: () => void;
  onSuccess: () => void;
}

const STANDARD_SPECIALTIES = [
  'Residential Luxury',
  'Modern Apartments',
  'Modular Kitchens',
  'Turnkey Interiors',
  'Commercial Spaces',
  'Office Design',
  'Renovation & Restoration',
  'Minimalist Architecture',
  'Landscape & Outdoor',
  'Sustainable & Eco',
];

// Upload helper for Supabase Storage bucket `designer-media` scoped to user.id folder path
async function uploadDesignerMedia(
  userId: string,
  uri: string,
  prefix: string
): Promise<string> {
  if (!uri || uri.startsWith('http://') || uri.startsWith('https://')) {
    return uri;
  }

  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const arrayBuffer = await new Response(blob).arrayBuffer();

    const fileExt = uri.split('.').pop()?.split('?')[0] || 'jpg';
    const fileName = `${userId}/${prefix}_${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from('designer-media')
      .upload(fileName, arrayBuffer, {
        contentType: blob.type || `image/${fileExt}`,
        upsert: true,
      });

    if (error) {
      console.error('[Dwellist Storage] Upload error:', error.message);
      throw new Error(`Media upload failed (${prefix}): ${error.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from('designer-media')
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  } catch (err: any) {
    console.error('[Dwellist Storage] Unexpected error uploading image:', err);
    throw err;
  }
}

export const DesignerProfileFormModal: React.FC<DesignerProfileFormModalProps> = ({
  visible,
  designer,
  onClose,
  onSuccess,
}) => {
  const theme = useTheme();
  const { user } = useAuth();

  const green = theme.primaryGreen;
  const brown = theme.primaryBrown;

  // Form states
  const [name, setName] = useState('');
  const [firm, setFirm] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState<'Gandhidham' | 'Ahmedabad'>('Gandhidham');
  const [address, setAddress] = useState('');
  const [experienceText, setExperienceText] = useState('5');
  const [completedProjectsText, setCompletedProjectsText] = useState('15');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [customSpecialty, setCustomSpecialty] = useState('');
  const [description, setDescription] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');

  // Image states
  const [avatarUri, setAvatarUri] = useState<string>('');
  const [coverUri, setCoverUri] = useState<string>('');
  const [portfolioUris, setPortfolioUris] = useState<string[]>([]);

  const [saving, setSaving] = useState(false);

  // Sync form states when designer prop or user changes
  useEffect(() => {
    if (designer) {
      setName(designer.name || user?.name || '');
      setFirm(designer.firm || user?.firmName || '');
      setArea(designer.area || 'Tagore Road');
      setCity(designer.city || (user?.city as any) || 'Gandhidham');
      setAddress(designer.address || '');
      setExperienceText(designer.experience ? designer.experience.toString() : '5');
      setCompletedProjectsText(designer.completedProjects ? designer.completedProjects.toString() : '15');
      setSelectedSpecialties(designer.specialties || ['Residential Luxury', 'Modern Apartments']);
      setDescription(designer.description || '');
      setContactNumber(designer.contactNumber || user?.phone || '');
      setEmail(designer.email || user?.email || '');
      setAvatarUri(designer.avatar || user?.avatar || '');
      setCoverUri(designer.coverImage || '');
      setPortfolioUris(designer.portfolio || []);
    } else {
      setName(user?.name || '');
      setFirm(user?.firmName || (user?.name ? `${user.name} Studio` : ''));
      setArea('Tagore Road');
      setCity((user?.city as any) || 'Gandhidham');
      setAddress('');
      setExperienceText('5');
      setCompletedProjectsText('12');
      setSelectedSpecialties(['Residential Luxury', 'Turnkey Interiors', 'Modular Kitchens']);
      setDescription('We specialize in modern residential interiors and smart space optimization across Gujarat.');
      setContactNumber(user?.phone || '+91 98250 12345');
      setEmail(user?.email || '');
      setAvatarUri(user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop');
      setCoverUri('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop');
      setPortfolioUris([
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop'
      ]);
    }
  }, [designer, user, visible]);

  // Image Picker Trigger
  const pickMedia = async (target: 'avatar' | 'cover' | 'portfolio') => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        alert('Media library permission is required to upload images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
        allowsMultipleSelection: target === 'portfolio',
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        if (target === 'avatar') {
          setAvatarUri(result.assets[0].uri);
        } else if (target === 'cover') {
          setCoverUri(result.assets[0].uri);
        } else if (target === 'portfolio') {
          const pickedUris = result.assets.map((a) => a.uri);
          setPortfolioUris((prev) => [...prev, ...pickedUris]);
        }
      }
    } catch (err: any) {
      console.error('Error picking image:', err);
      alert('Could not open image picker: ' + (err.message || 'Unknown error'));
    }
  };

  const toggleSpecialty = (spec: string) => {
    if (selectedSpecialties.includes(spec)) {
      setSelectedSpecialties((prev) => prev.filter((s) => s !== spec));
    } else {
      setSelectedSpecialties((prev) => [...prev, spec]);
    }
  };

  const addCustomSpecialty = () => {
    const trimmed = customSpecialty.trim();
    if (trimmed && !selectedSpecialties.includes(trimmed)) {
      setSelectedSpecialties((prev) => [...prev, trimmed]);
      setCustomSpecialty('');
    }
  };

  const removePortfolioImage = (index: number) => {
    setPortfolioUris((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit Listing Form (Create or Update)
  const handleSubmit = async () => {
    if (!user) {
      alert('You must be logged in as a designer to save your profile.');
      return;
    }

    if (!name.trim() || !firm.trim() || !city.trim()) {
      alert('Please fill in your Lead Name, Firm Name, and City.');
      return;
    }

    setSaving(true);

    try {
      // Upload images to Supabase Storage bucket `designer-media/${user.id}/`
      let finalAvatar = avatarUri;
      let finalCover = coverUri;
      let finalPortfolio: string[] = [];

      if (avatarUri && !avatarUri.startsWith('http')) {
        finalAvatar = await uploadDesignerMedia(user.id, avatarUri, 'avatar');
      }

      if (coverUri && !coverUri.startsWith('http')) {
        finalCover = await uploadDesignerMedia(user.id, coverUri, 'cover');
      }

      for (let i = 0; i < portfolioUris.length; i++) {
        const pUri = portfolioUris[i];
        if (pUri && !pUri.startsWith('http')) {
          const uploaded = await uploadDesignerMedia(user.id, pUri, `portfolio_${i}`);
          finalPortfolio.push(uploaded);
        } else if (pUri) {
          finalPortfolio.push(pUri);
        }
      }

      const payload = {
        user_id: user.id,
        name: name.trim(),
        firm: firm.trim(),
        area: area.trim(),
        city: city.trim(),
        address: address.trim(),
        experience: parseInt(experienceText, 10) || 0,
        completed_projects: parseInt(completedProjectsText, 10) || 0,
        specialties: selectedSpecialties,
        description: description.trim(),
        contact_number: contactNumber.trim(),
        email: email.trim(),
        avatar: finalAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
        cover_image: finalCover || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop',
        portfolio: finalPortfolio,
      };

      if (designer?.id) {
        // Update existing listing
        const { error } = await supabase
          .from('designers')
          .update(payload)
          .eq('id', designer.id)
          .eq('user_id', user.id);

        if (error) {
          throw new Error(`Database error updating profile: ${error.message}`);
        }
      } else {
        // Create new listing
        const { error } = await supabase
          .from('designers')
          .insert(payload);

        if (error) {
          throw new Error(`Database error creating listing: ${error.message}`);
        }
      }

      alert(designer ? 'Studio listing updated successfully!' : 'Studio listing created successfully!');
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('[Dwellist Profile Form] Error saving listing:', err);
      alert(err.message || 'Failed to save studio profile. Please check your network connection.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <ThemedView style={styles.container}>
        {/* Header Bar */}
        <View style={[styles.headerBar, { borderBottomColor: theme.border, backgroundColor: theme.cardBackground }]}>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close-circle-outline" size={26} color={theme.text} />
          </Pressable>
          <View style={{ alignItems: 'center' }}>
            <ThemedText type="smallBold" style={{ fontSize: 16, color: theme.text }}>
              {designer ? 'Edit Studio Profile' : 'Create Studio Listing'}
            </ThemedText>
            <ThemedText style={{ fontSize: 11, color: theme.textSecondary }}>
              Dwellist Verified Designer Portal
            </ThemedText>
          </View>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView contentContainerStyle={styles.formScroll} showsVerticalScrollIndicator={false}>
          {/* Section 1: Studio Media & Branding */}
          <View style={[styles.cardSection, { backgroundColor: theme.cardBackground, borderColor: theme.border, shadowColor: theme.cardShadow }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconBg, { backgroundColor: theme.accentBrownLight }]}>
                <Ionicons name="images-outline" size={16} color={brown} />
              </View>
              <View>
                <ThemedText type="smallBold" style={[styles.sectionTitle, { color: brown }]}>
                  MEDIA & BRANDING
                </ThemedText>
                <ThemedText style={{ fontSize: 11, color: theme.textSecondary }}>
                  Upload high quality photos of your work and firm logo
                </ThemedText>
              </View>
            </View>

            {/* Cover Image Picker */}
            <View style={styles.fieldGroup}>
              <ThemedText style={styles.inputLabel}>Cover Banner Photo</ThemedText>
              <View style={[styles.coverPickerBox, { borderColor: theme.border, backgroundColor: theme.backgroundElement }]}>
                {coverUri ? (
                  <Image source={{ uri: coverUri }} style={styles.coverPreview} contentFit="cover" />
                ) : (
                  <View style={styles.coverPlaceholder}>
                    <Ionicons name="image-outline" size={32} color={theme.textSecondary} />
                    <ThemedText style={{ fontSize: 12, color: theme.textSecondary, marginTop: 4 }}>
                      No Cover Image Selected
                    </ThemedText>
                  </View>
                )}
                <Pressable
                  onPress={() => pickMedia('cover')}
                  style={({ pressed }) => [
                    styles.pickBtn,
                    { backgroundColor: green, borderColor: green },
                    pressed && { opacity: 0.85 }
                  ]}
                >
                  <Ionicons name="camera-outline" size={15} color="#FFFFFF" />
                  <Text style={styles.pickBtnTextWhite}>
                    {coverUri ? 'Change Cover Banner' : 'Select Cover Photo'}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Avatar Picker */}
            <View style={styles.fieldGroup}>
              <ThemedText style={styles.inputLabel}>Lead Designer Avatar / Logo</ThemedText>
              <View style={styles.avatarPickerRow}>
                <View style={styles.avatarWrapper}>
                  {avatarUri ? (
                    <Image source={{ uri: avatarUri }} style={styles.avatarPreview} contentFit="cover" />
                  ) : (
                    <View style={[styles.avatarFallback, { backgroundColor: theme.accentBrownLight }]}>
                      <Ionicons name="person" size={28} color={brown} />
                    </View>
                  )}
                  <Pressable onPress={() => pickMedia('avatar')} style={[styles.avatarBadgeBtn, { backgroundColor: green }]}>
                    <Ionicons name="camera" size={12} color="#FFFFFF" />
                  </Pressable>
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText type="smallBold" style={{ fontSize: 13, color: theme.text }}>
                    Profile Photo
                  </ThemedText>
                  <ThemedText style={{ fontSize: 11, color: theme.textSecondary, marginTop: 2 }}>
                    Will be displayed on your studio card and consultation requests.
                  </ThemedText>
                  <Pressable
                    onPress={() => pickMedia('avatar')}
                    style={({ pressed }) => [
                      styles.outlinePickBtn,
                      { borderColor: theme.border, backgroundColor: theme.backgroundElement },
                      pressed && { opacity: 0.8 }
                    ]}
                  >
                    <Text style={[styles.outlinePickBtnText, { color: theme.text }]}>
                      {avatarUri ? 'Replace Photo' : 'Upload Avatar'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Portfolio Gallery Picker */}
            <View style={styles.fieldGroup}>
              <ThemedText style={styles.inputLabel}>
                Portfolio Gallery Showcase ({portfolioUris.length} photos)
              </ThemedText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingVertical: 4 }}>
                {portfolioUris.map((img, idx) => (
                  <View key={idx} style={styles.portfolioThumbBox}>
                    <Image source={{ uri: img }} style={styles.portfolioThumb} contentFit="cover" />
                    <Pressable onPress={() => removePortfolioImage(idx)} style={styles.removeImgBtn}>
                      <Ionicons name="close-circle" size={20} color="#C0392B" />
                    </Pressable>
                  </View>
                ))}
                <Pressable
                  onPress={() => pickMedia('portfolio')}
                  style={({ pressed }) => [
                    styles.addPortfolioBox,
                    { borderColor: green, backgroundColor: theme.accentGreenLight },
                    pressed && { opacity: 0.8 }
                  ]}
                >
                  <Ionicons name="add-circle-outline" size={26} color={green} />
                  <Text style={{ fontSize: 11, color: green, fontWeight: '700', marginTop: 4 }}>+ Add Photos</Text>
                </Pressable>
              </ScrollView>
            </View>
          </View>

          {/* Section 2: Studio & Lead Information */}
          <View style={[styles.cardSection, { backgroundColor: theme.cardBackground, borderColor: theme.border, shadowColor: theme.cardShadow }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconBg, { backgroundColor: theme.accentGreenLight }]}>
                <Ionicons name="briefcase-outline" size={16} color={green} />
              </View>
              <View>
                <ThemedText type="smallBold" style={[styles.sectionTitle, { color: green }]}>
                  STUDIO & LEAD DETAILS
                </ThemedText>
                <ThemedText style={{ fontSize: 11, color: theme.textSecondary }}>
                  Public studio name, principal lead, and location
                </ThemedText>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <ThemedText style={styles.inputLabel}>Studio / Firm Name *</ThemedText>
              <TextInput
                style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.inputBackground }]}
                placeholder="e.g. Studio Form & Space"
                placeholderTextColor={theme.textSecondary}
                value={firm}
                onChangeText={setFirm}
              />
            </View>

            <View style={styles.fieldGroup}>
              <ThemedText style={styles.inputLabel}>Lead Architect / Interior Designer Name *</ThemedText>
              <TextInput
                style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.inputBackground }]}
                placeholder="e.g. Ar. Priya Sharma"
                placeholderTextColor={theme.textSecondary}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.fieldGroup}>
              <ThemedText style={styles.inputLabel}>Primary City *</ThemedText>
              <View style={styles.cityRow}>
                {(['Gandhidham', 'Ahmedabad'] as const).map((c) => (
                  <Pressable
                    key={c}
                    onPress={() => setCity(c)}
                    style={[
                      styles.cityBtn,
                      {
                        borderColor: city === c ? green : theme.border,
                        backgroundColor: city === c ? theme.accentGreenLight : theme.backgroundElement,
                      }
                    ]}
                  >
                    <Ionicons name="location-outline" size={14} color={city === c ? green : theme.textSecondary} />
                    <Text style={{ fontSize: 13, fontWeight: '700', color: city === c ? green : theme.textSecondary, marginLeft: 4 }}>
                      {c}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.fieldRow}>
              <View style={{ flex: 1 }}>
                <ThemedText style={styles.inputLabel}>Area / Sector</ThemedText>
                <TextInput
                  style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.inputBackground }]}
                  placeholder="e.g. Tagore Road"
                  placeholderTextColor={theme.textSecondary}
                  value={area}
                  onChangeText={setArea}
                />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText style={styles.inputLabel}>Experience (Years)</ThemedText>
                <TextInput
                  style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.inputBackground }]}
                  placeholder="e.g. 8"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="number-pad"
                  value={experienceText}
                  onChangeText={setExperienceText}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <ThemedText style={styles.inputLabel}>Full Office Address</ThemedText>
              <TextInput
                style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.inputBackground }]}
                placeholder="e.g. Plot 42, Commercial Complex, Sector 1-A"
                placeholderTextColor={theme.textSecondary}
                value={address}
                onChangeText={setAddress}
              />
            </View>
          </View>

          {/* Section 3: Interactive Specialties Chip Selector */}
          <View style={[styles.cardSection, { backgroundColor: theme.cardBackground, borderColor: theme.border, shadowColor: theme.cardShadow }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconBg, { backgroundColor: theme.accentBrownLight }]}>
                <Ionicons name="ribbon-outline" size={16} color={brown} />
              </View>
              <View>
                <ThemedText type="smallBold" style={[styles.sectionTitle, { color: brown }]}>
                  SPECIALTY STYLES & SERVICES
                </ThemedText>
                <ThemedText style={{ fontSize: 11, color: theme.textSecondary }}>
                  Tap to select design styles your studio excels at
                </ThemedText>
              </View>
            </View>

            <View style={styles.chipsContainer}>
              {STANDARD_SPECIALTIES.map((spec) => {
                const isSelected = selectedSpecialties.includes(spec);
                return (
                  <Pressable
                    key={spec}
                    onPress={() => toggleSpecialty(spec)}
                    style={({ pressed }) => [
                      styles.specialtyChip,
                      {
                        backgroundColor: isSelected ? theme.accentGreenLight : theme.backgroundElement,
                        borderColor: isSelected ? green : theme.border,
                      },
                      pressed && { opacity: 0.8 }
                    ]}
                  >
                    <Ionicons
                      name={isSelected ? 'checkmark-circle' : 'add-circle-outline'}
                      size={14}
                      color={isSelected ? green : theme.textSecondary}
                    />
                    <Text
                      style={[
                        styles.chipText,
                        { color: isSelected ? green : theme.text }
                      ]}
                    >
                      {spec}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Custom Specialty Input */}
            <View style={[styles.customSpecRow, { marginTop: 8 }]}>
              <TextInput
                style={[styles.input, { flex: 1, borderColor: theme.border, color: theme.text, backgroundColor: theme.inputBackground }]}
                placeholder="Add custom specialty style..."
                placeholderTextColor={theme.textSecondary}
                value={customSpecialty}
                onChangeText={setCustomSpecialty}
              />
              <Pressable
                onPress={addCustomSpecialty}
                style={({ pressed }) => [
                  styles.addCustomBtn,
                  { backgroundColor: brown },
                  pressed && { opacity: 0.85 }
                ]}
              >
                <Ionicons name="add" size={18} color="#FFFFFF" />
                <Text style={styles.addCustomText}>Add</Text>
              </Pressable>
            </View>

            <View style={styles.fieldGroup}>
              <ThemedText style={styles.inputLabel}>Studio Description & Philosophy</ThemedText>
              <TextInput
                style={[styles.input, styles.multilineInput, { borderColor: theme.border, color: theme.text, backgroundColor: theme.inputBackground }]}
                placeholder="Describe your studio's design philosophy, signature aesthetic, materials used, and client consultation process..."
                placeholderTextColor={theme.textSecondary}
                multiline
                numberOfLines={4}
                value={description}
                onChangeText={setDescription}
              />
            </View>
          </View>

          {/* Section 4: Contact & Inquiries Info */}
          <View style={[styles.cardSection, { backgroundColor: theme.cardBackground, borderColor: theme.border, shadowColor: theme.cardShadow }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconBg, { backgroundColor: theme.accentGreenLight }]}>
                <Ionicons name="call-outline" size={16} color={green} />
              </View>
              <View>
                <ThemedText type="smallBold" style={[styles.sectionTitle, { color: green }]}>
                  CONTACT CHANNELS
                </ThemedText>
                <ThemedText style={{ fontSize: 11, color: theme.textSecondary }}>
                  Where client consultation inquiries will be routed
                </ThemedText>
              </View>
            </View>

            <View style={styles.fieldRow}>
              <View style={{ flex: 1 }}>
                <ThemedText style={styles.inputLabel}>Contact Phone *</ThemedText>
                <TextInput
                  style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.inputBackground }]}
                  placeholder="+91 98250 00000"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="phone-pad"
                  value={contactNumber}
                  onChangeText={setContactNumber}
                />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText style={styles.inputLabel}>Contact Email</ThemedText>
                <TextInput
                  style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.inputBackground }]}
                  placeholder="studio@dwellist.in"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>
          </View>

          {/* Form Actions */}
          <View style={styles.actionsRow}>
            <Pressable
              onPress={onClose}
              disabled={saving}
              style={({ pressed }) => [
                styles.cancelBtn,
                { backgroundColor: theme.backgroundElement, borderColor: theme.border },
                pressed && { opacity: 0.8 }
              ]}
            >
              <Text style={[styles.cancelBtnText, { color: theme.text }]}>Cancel</Text>
            </Pressable>

            <Pressable
              onPress={handleSubmit}
              disabled={saving}
              style={({ pressed }) => [
                styles.submitBtn,
                { backgroundColor: green },
                pressed && { opacity: 0.9 }
              ]}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
                  <Text style={styles.submitBtnText}>
                    {designer ? 'Save Changes' : 'Create Listing'}
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </ThemedView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  closeBtn: {
    padding: 4,
  },
  formScroll: {
    padding: Spacing.four,
    gap: Spacing.four,
    paddingBottom: 50,
  },
  cardSection: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 14,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 2,
  },
  sectionIconBg: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
  },
  multilineInput: {
    minHeight: 84,
    textAlignVertical: 'top',
  },
  cityRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cityBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  coverPickerBox: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
    padding: 12,
    gap: 10,
  },
  coverPreview: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  coverPlaceholder: {
    width: '100%',
    height: 90,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarPreview: {
    width: 66,
    height: 66,
    borderRadius: 33,
  },
  avatarFallback: {
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBadgeBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  pickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
  },
  pickBtnTextWhite: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  outlinePickBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 6,
  },
  outlinePickBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  portfolioThumbBox: {
    position: 'relative',
  },
  portfolioThumb: {
    width: 100,
    height: 76,
    borderRadius: 10,
  },
  removeImgBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  addPortfolioBox: {
    width: 100,
    height: 76,
    borderRadius: 10,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specialtyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  customSpecRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  addCustomBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 10,
  },
  addCustomText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontWeight: '700',
    fontSize: 14,
  },
  submitBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    paddingVertical: 14,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
