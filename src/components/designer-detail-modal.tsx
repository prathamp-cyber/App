import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, View, Pressable, TextInput, Alert, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAppContext } from '@/context/AppContext';
import { Designer } from '@/constants/mockData';

interface DesignerDetailModalProps {
  designer: Designer | null;
  visible: boolean;
  onClose: () => void;
}

export const DesignerDetailModal: React.FC<DesignerDetailModalProps> = ({
  designer,
  visible,
  onClose,
}) => {
  const theme = useTheme();
  const { isSaved, toggleSave, isCompared, toggleCompare } = useAppContext();
  const [inquiryVisible, setInquiryVisible] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [projectType, setProjectType] = useState('Residential'); // Residential, Commercial, Renovation
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  if (!designer) return null;

  const saved = isSaved(designer.id);
  const compared = isCompared(designer.id);
  const brown = theme.primaryBrown;
  const green = theme.primaryGreen;

  const handleInquirySubmit = () => {
    if (!clientName.trim() || !clientPhone.trim()) {
      alert("Please fill in your name and phone number.");
      return;
    }
    setInquirySubmitted(true);
    setTimeout(() => {
      setInquirySubmitted(false);
      setInquiryVisible(false);
      setClientName('');
      setClientPhone('');
      alert(`Inquiry sent to ${designer.firm}! They will contact you shortly.`);
    }, 1500);
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <ThemedView style={styles.modalContainer}>
        {/* Header Action Bar */}
        <View style={[styles.headerBar, { borderBottomColor: theme.border }]}>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons
              name="chevron-back"
              size={24}
              color={theme.text}
            />
          </Pressable>
          <ThemedText type="smallBold" style={styles.headerTitle}>
            Designer Profile
          </ThemedText>
          <View style={styles.headerRightActions}>
            <Pressable onPress={() => toggleCompare(designer.id)} style={styles.actionIconButton}>
              <Ionicons
                name={compared ? 'checkbox' : 'square-outline'}
                size={20}
                color={compared ? green : theme.textSecondary}
              />
            </Pressable>
            <Pressable onPress={() => toggleSave(designer.id)} style={styles.actionIconButton}>
              <Ionicons
                name={saved ? 'heart' : 'heart-outline'}
                size={20}
                color={saved ? '#C0392B' : theme.textSecondary}
              />
            </Pressable>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Cover & Avatar Header */}
          <View style={styles.profileHeader}>
            <Image source={{ uri: designer.coverImage }} style={styles.coverImage} />
            <View style={styles.avatarContainer}>
              <Image source={{ uri: designer.avatar }} style={styles.avatarImage} />
            </View>
          </View>

          {/* Firm Details */}
          <View style={styles.firmDetailsContainer}>
            <ThemedText type="subtitle" style={[styles.firmName, { color: green }]}>
              {designer.firm}
            </ThemedText>
            <ThemedText style={styles.designerLead} themeColor="textSecondary">
              Lead Designer: {designer.name}
            </ThemedText>

            <View style={styles.locationContainer}>
              <Ionicons
                name="location"
                size={14}
                color={brown}
              />
              <ThemedText style={styles.addressText} themeColor="textSecondary">
                {designer.address}
              </ThemedText>
            </View>
          </View>

          {/* Stat Row */}
          <View style={[styles.statRow, { backgroundColor: theme.backgroundElement }]}>
            <View style={styles.statBox}>
              <ThemedText type="smallBold" style={styles.statVal}>
                {designer.rating} ★
              </ThemedText>
              <ThemedText style={styles.statLabel}>Google Rating</ThemedText>
            </View>
            <View style={styles.divider} />
            <View style={styles.statBox}>
              <ThemedText type="smallBold" style={styles.statVal}>
                {designer.experience} Yrs
              </ThemedText>
              <ThemedText style={styles.statLabel}>Experience</ThemedText>
            </View>
            <View style={styles.divider} />
            <View style={styles.statBox}>
              <ThemedText type="smallBold" style={styles.statVal}>
                {designer.completedProjects}+
              </ThemedText>
              <ThemedText style={styles.statLabel}>Projects</ThemedText>
            </View>
          </View>

          {/* About Section */}
          <View style={styles.sectionContainer}>
            <ThemedText type="smallBold" style={[styles.sectionTitle, { color: brown }]}>
              About the Studio
            </ThemedText>
            <ThemedText style={styles.descriptionText} themeColor="textSecondary">
              {designer.description}
            </ThemedText>
          </View>

          {/* Specialties / Styles */}
          <View style={styles.sectionContainer}>
            <ThemedText type="smallBold" style={[styles.sectionTitle, { color: brown }]}>
              Specialty Styles
            </ThemedText>
            <View style={styles.specialtiesList}>
              {designer.specialties.map((spec, i) => (
                <View key={i} style={[styles.specialtyBadge, { backgroundColor: theme.accentBrownLight }]}>
                  <ThemedText style={[styles.specialtyText, { color: brown }]}>
                    {spec}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>

          {/* Portfolio Gallery */}
          <View style={styles.sectionContainer}>
            <ThemedText type="smallBold" style={[styles.sectionTitle, { color: brown }]}>
              Portfolio Gallery
            </ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryScroll}>
              {designer.portfolio.map((img, i) => (
                <Image key={i} source={{ uri: img }} style={styles.galleryImage} contentFit="cover" />
              ))}
            </ScrollView>
          </View>

          {/* Client Survey Metrics */}
          <View style={styles.sectionContainer}>
            <ThemedText type="smallBold" style={[styles.sectionTitle, { color: brown }]}>
              Customer Survey Ratings
            </ThemedText>
            <ThemedText style={styles.surveySubtitle} themeColor="textSecondary">
              Based on independent verified customer surveys
            </ThemedText>

            {/* Progress Bars */}
            {(Object.keys(designer.surveyMetrics) as Array<keyof typeof designer.surveyMetrics>).map((metric) => {
              const score = designer.surveyMetrics[metric];
              return (
                <View key={metric} style={styles.metricRow}>
                  <View style={styles.metricLabelRow}>
                    <ThemedText style={styles.metricName}>
                      {metric.charAt(0).toUpperCase() + metric.slice(1)}
                    </ThemedText>
                    <ThemedText style={styles.metricScore}>{score} / 5.0</ThemedText>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${(score / 5) * 100}%`, backgroundColor: green }]} />
                  </View>
                </View>
              );
            })}
          </View>

          {/* Google Reviews */}
          <View style={styles.sectionContainer}>
            <View style={styles.reviewsTitleRow}>
              <ThemedText type="smallBold" style={[styles.sectionTitle, { color: brown }]}>
                Google Reviews ({designer.googleReviewCount})
              </ThemedText>
              <ThemedText style={styles.reviewsLogo}>Verified</ThemedText>
            </View>

            {designer.reviews.map((rev) => (
              <View key={rev.id} style={[styles.reviewCard, { borderColor: theme.border }]}>
                <View style={styles.reviewHeader}>
                  <ThemedText type="smallBold" style={styles.reviewerName}>{rev.userName}</ThemedText>
                  <ThemedText style={styles.reviewDate}>{rev.date}</ThemedText>
                </View>
                <View style={styles.reviewStars}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Ionicons
                      key={i}
                      name="star"
                      size={10}
                      color={i < rev.rating ? "#D4AF37" : "#C0C0C0"}
                    />
                  ))}
                </View>
                <ThemedText style={styles.reviewComment} themeColor="textSecondary">
                  "{rev.comment}"
                </ThemedText>
              </View>
            ))}
          </View>

          {/* Additional details */}
          <View style={styles.footerInfoBox}>
            <ThemedText style={styles.footerInfoText} themeColor="textSecondary">
              Response Time: {designer.responseTime}
            </ThemedText>
            <ThemedText style={styles.footerInfoText} themeColor="textSecondary">
              Email: {designer.email}
            </ThemedText>
          </View>
        </ScrollView>

        {/* Contact/Consultation Button Floating at Bottom */}
        <View style={[styles.floatingActionContainer, { borderTopColor: theme.border, backgroundColor: theme.background }]}>
          <Pressable
            style={({ pressed }) => [
              styles.consultationButton,
              { backgroundColor: green },
              pressed && styles.buttonPressed
            ]}
            onPress={() => setInquiryVisible(true)}
          >
            <ThemedText style={styles.buttonText}>Book Free Consultation</ThemedText>
          </Pressable>
        </View>

        {/* Quick Consultation Inquiry Modal */}
        <Modal
          visible={inquiryVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setInquiryVisible(false)}
        >
          <View style={styles.overlayBg}>
            <View style={[styles.inquiryBox, { backgroundColor: theme.background }]}>
              <View style={styles.inquiryHeader}>
                <ThemedText type="smallBold" style={{ color: green }}>
                  Inquire with {designer.firm}
                </ThemedText>
                <Pressable onPress={() => setInquiryVisible(false)}>
                  <Ionicons
                    name="close"
                    size={20}
                    color={theme.text}
                  />
                </Pressable>
              </View>

              {inquirySubmitted ? (
                <View style={styles.successContainer}>
                  <Ionicons
                    name="checkmark-circle"
                    size={50}
                    color={green}
                  />
                  <ThemedText type="smallBold" style={{ marginTop: 12, textAlign: 'center' }}>
                    Sending Request...
                  </ThemedText>
                </View>
              ) : (
                <View style={styles.inquiryForm}>
                  <ThemedText style={styles.inputLabel}>Your Name</ThemedText>
                  <TextInput
                    style={[styles.input, { borderColor: theme.border, color: theme.text }]}
                    placeholder="Enter your full name"
                    placeholderTextColor={theme.textSecondary}
                    value={clientName}
                    onChangeText={setClientName}
                  />

                  <ThemedText style={styles.inputLabel}>Mobile Number</ThemedText>
                  <TextInput
                    style={[styles.input, { borderColor: theme.border, color: theme.text }]}
                    placeholder="Enter 10-digit mobile number"
                    placeholderTextColor={theme.textSecondary}
                    keyboardType="phone-pad"
                    value={clientPhone}
                    onChangeText={setClientPhone}
                  />

                  <ThemedText style={styles.inputLabel}>Project Type</ThemedText>
                  <View style={styles.projectTypeRow}>
                    {['Residential', 'Commercial', 'Renovation'].map((type) => (
                      <Pressable
                        key={type}
                        style={[
                          styles.projectTypeButton,
                          {
                            borderColor: projectType === type ? green : theme.border,
                            backgroundColor: projectType === type ? theme.accentGreenLight : 'transparent'
                          }
                        ]}
                        onPress={() => setProjectType(type)}
                      >
                        <Text style={{ fontSize: 11, fontWeight: '600', color: projectType === type ? green : theme.textSecondary }}>
                          {type}
                        </Text>
                      </Pressable>
                    ))}
                  </View>

                  <Pressable
                    style={({ pressed }) => [
                      styles.submitButton,
                      { backgroundColor: green },
                      pressed && styles.buttonPressed
                    ]}
                    onPress={handleInquirySubmit}
                  >
                    <Text style={styles.submitButtonText}>Submit Consultation Request</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        </Modal>
      </ThemedView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
  },
  headerRightActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionIconButton: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 120, // Give room for floating button
  },
  profileHeader: {
    position: 'relative',
    height: 180,
    marginBottom: 50,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  avatarContainer: {
    position: 'absolute',
    bottom: -40,
    left: Spacing.four,
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  firmDetailsContainer: {
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.four,
  },
  firmName: {
    fontSize: 22,
    marginBottom: 4,
  },
  designerLead: {
    fontSize: 14,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addressText: {
    fontSize: 12,
    flex: 1,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 14,
    marginHorizontal: Spacing.four,
    borderRadius: 10,
    marginBottom: Spacing.four,
  },
  statBox: {
    alignItems: 'center',
  },
  statVal: {
    fontSize: 15,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#80848C',
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: '60%',
    backgroundColor: '#DCDFE2',
    alignSelf: 'center',
  },
  sectionContainer: {
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.four,
  },
  sectionTitle: {
    fontSize: 15,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 13,
    lineHeight: 18,
  },
  specialtiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specialtyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  specialtyText: {
    fontSize: 11,
    fontWeight: '700',
  },
  galleryScroll: {
    gap: Spacing.two,
  },
  galleryImage: {
    width: 150,
    height: 110,
    borderRadius: 10,
  },
  surveySubtitle: {
    fontSize: 11,
    marginBottom: Spacing.three,
  },
  metricRow: {
    marginBottom: Spacing.three,
  },
  metricLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  metricName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5A6065',
  },
  metricScore: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E2022',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#ECEAE4',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  reviewsTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  reviewsLogo: {
    fontSize: 10,
    color: '#34A853', // Google Green
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  reviewCard: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: Spacing.two,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  reviewerName: {
    fontSize: 12,
  },
  reviewDate: {
    fontSize: 10,
    color: '#80848C',
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 6,
  },
  reviewComment: {
    fontSize: 12,
    fontStyle: 'italic',
    lineHeight: 16,
  },
  footerInfoBox: {
    paddingHorizontal: Spacing.four,
    gap: 4,
    marginTop: Spacing.two,
  },
  footerInfoText: {
    fontSize: 11,
  },
  floatingActionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderTopWidth: 1,
  },
  consultationButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  overlayBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  inquiryBox: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 16,
    padding: Spacing.four,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  inquiryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.five,
  },
  inquiryForm: {
    gap: Spacing.two,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5A6065',
    marginBottom: 2,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    marginBottom: Spacing.two,
  },
  projectTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.four,
  },
  projectTypeButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  submitButton: {
    borderRadius: 10,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
