import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/context/AuthContext';
import { useAppContext } from '@/context/AppContext';
import { Spacing } from '@/constants/theme';

export function DesignerDashboard() {
  const theme = useTheme();
  const { user, logout, openProfileModal } = useAuth();
  const { city } = useAppContext();

  const green = theme.primaryGreen;
  const brown = theme.primaryBrown;

  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'leads' | 'services'>('overview');

  // Mock leads data for designer
  const mockLeads = [
    {
      id: 'l1',
      clientName: 'Rahul Mehta',
      projectType: '3BHK Interior Turnkey',
      budget: '₹15 - ₹20 Lakhs',
      date: 'Today, 10:30 AM',
      phone: '+91 98980 12345',
      status: 'New Lead',
    },
    {
      id: 'l2',
      clientName: 'Ananya Patel',
      projectType: 'Living & Modular Kitchen',
      budget: '₹8 - ₹12 Lakhs',
      date: 'Yesterday',
      phone: '+91 98251 67890',
      status: 'In Discussion',
    },
    {
      id: 'l3',
      clientName: 'Karan Shah',
      projectType: 'Commercial Office Space (2500 sq ft)',
      budget: '₹35 - ₹40 Lakhs',
      date: '24 Aug 2026',
      phone: '+91 97243 44556',
      status: 'Consultation Scheduled',
    },
  ];

  // Mock projects data
  const mockProjects = [
    {
      id: 'p1',
      title: 'Modern Minimalist Villa',
      location: 'Sector 1A, Gandhidham',
      category: 'Residential',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
      views: '640',
      likes: '42',
    },
    {
      id: 'p2',
      title: 'Nordic Inspired Studio Apartment',
      location: 'Tagore Road, Gandhidham',
      category: 'Turnkey',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop',
      views: '480',
      likes: '31',
    },
    {
      id: 'p3',
      title: 'Luxury Corporate Office',
      location: 'SG Highway, Ahmedabad',
      category: 'Commercial',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop',
      views: '890',
      likes: '75',
    },
  ];

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Studio Header Card */}
      <View style={[styles.headerCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
        <View style={styles.headerTop}>
          <View style={styles.avatarContainer}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} contentFit="cover" />
            ) : (
              <View style={[styles.avatarFallback, { backgroundColor: theme.accentBrownLight }]}>
                <ThemedText type="subtitle" style={{ color: brown }}>
                  {user?.name.charAt(0) || 'D'}
                </ThemedText>
              </View>
            )}
            <View style={[styles.verifiedBadge, { backgroundColor: brown }]}>
              <Ionicons name="checkmark" size={10} color="#FFFFFF" />
            </View>
          </View>

          <View style={{ flex: 1, marginLeft: 12 }}>
            <View style={[styles.roleTag, { backgroundColor: theme.accentBrownLight }]}>
              <Ionicons name="briefcase" size={11} color={brown} />
              <Text style={[styles.roleTagText, { color: brown }]}>INTERIOR DESIGNER PORTAL</Text>
            </View>

            <ThemedText type="subtitle" style={[styles.firmTitle, { color: theme.text }]}>
              {user?.firmName || `${user?.name || 'Designer'} Studio`}
            </ThemedText>

            <ThemedText style={{ fontSize: 12, color: theme.textSecondary }}>
              Lead: {user?.name || 'Lead Architect'} • {user?.city || city}, Gujarat
            </ThemedText>
          </View>
        </View>

        {/* Quick Action Bar */}
        <View style={[styles.headerActions, { borderTopColor: theme.border }]}>
          <Pressable
            onPress={openProfileModal}
            style={({ pressed }) => [
              styles.actionBtn,
              { backgroundColor: theme.backgroundElement, borderColor: theme.border },
              pressed && { opacity: 0.8 }
            ]}
          >
            <Ionicons name="settings-outline" size={15} color={theme.text} />
            <ThemedText type="smallBold" style={{ fontSize: 12, color: theme.text }}>
              Edit Studio Profile
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={logout}
            style={({ pressed }) => [
              styles.actionBtn,
              { backgroundColor: theme.accentBrownLight, borderColor: theme.border },
              pressed && { opacity: 0.8 }
            ]}
          >
            <Ionicons name="log-out-outline" size={15} color={brown} />
            <ThemedText type="smallBold" style={{ fontSize: 12, color: brown }}>
              Sign Out
            </ThemedText>
          </Pressable>
        </View>
      </View>

      {/* Studio Analytics Grid */}
      <View style={styles.metricsGrid}>
        <View style={[styles.metricCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <View style={[styles.metricIconBg, { backgroundColor: theme.accentGreenLight }]}>
            <Ionicons name="eye-outline" size={18} color={green} />
          </View>
          <ThemedText type="subtitle" style={[styles.metricValue, { color: green }]}>
            1,480
          </ThemedText>
          <ThemedText style={styles.metricLabel} themeColor="textSecondary">
            Profile Views
          </ThemedText>
        </View>

        <View style={[styles.metricCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <View style={[styles.metricIconBg, { backgroundColor: theme.accentBrownLight }]}>
            <Ionicons name="chatbubbles-outline" size={18} color={brown} />
          </View>
          <ThemedText type="subtitle" style={[styles.metricValue, { color: brown }]}>
            12
          </ThemedText>
          <ThemedText style={styles.metricLabel} themeColor="textSecondary">
            Client Leads
          </ThemedText>
        </View>

        <View style={[styles.metricCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <View style={[styles.metricIconBg, { backgroundColor: theme.accentGreenLight }]}>
            <Ionicons name="bookmark-outline" size={18} color={green} />
          </View>
          <ThemedText type="subtitle" style={[styles.metricValue, { color: green }]}>
            94
          </ThemedText>
          <ThemedText style={styles.metricLabel} themeColor="textSecondary">
            Client Saves
          </ThemedText>
        </View>

        <View style={[styles.metricCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <View style={[styles.metricIconBg, { backgroundColor: theme.accentBrownLight }]}>
            <Ionicons name="star" size={18} color="#F1C40F" />
          </View>
          <ThemedText type="subtitle" style={[styles.metricValue, { color: theme.text }]}>
            5.0 ★
          </ThemedText>
          <ThemedText style={styles.metricLabel} themeColor="textSecondary">
            Client Rating
          </ThemedText>
        </View>
      </View>

      {/* Navigation Tabs for Designer Studio */}
      <View style={[styles.tabRow, { backgroundColor: theme.backgroundElement }]}>
        <Pressable
          onPress={() => setActiveTab('overview')}
          style={[styles.tabBtn, activeTab === 'overview' && [styles.tabActive, { backgroundColor: theme.cardBackground, borderColor: theme.border }]]}
        >
          <ThemedText type="smallBold" style={{ fontSize: 12, color: activeTab === 'overview' ? brown : theme.textSecondary }}>
            Overview
          </ThemedText>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('projects')}
          style={[styles.tabBtn, activeTab === 'projects' && [styles.tabActive, { backgroundColor: theme.cardBackground, borderColor: theme.border }]]}
        >
          <ThemedText type="smallBold" style={{ fontSize: 12, color: activeTab === 'projects' ? brown : theme.textSecondary }}>
            Portfolio ({mockProjects.length})
          </ThemedText>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('leads')}
          style={[styles.tabBtn, activeTab === 'leads' && [styles.tabActive, { backgroundColor: theme.cardBackground, borderColor: theme.border }]]}
        >
          <ThemedText type="smallBold" style={{ fontSize: 12, color: activeTab === 'leads' ? brown : theme.textSecondary }}>
            Client Leads ({mockLeads.length})
          </ThemedText>
        </Pressable>
      </View>

      {/* TAB CONTENT 1: CLIENT LEADS SECTION */}
      {(activeTab === 'overview' || activeTab === 'leads') && (
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <ThemedText type="smallBold" style={[styles.sectionSubtitle, { color: brown }]}>
                CLIENT INQUIRIES & LEADS
              </ThemedText>
              <ThemedText type="subtitle" style={{ fontSize: 18, color: theme.text }}>
                Recent Project Inquiries
              </ThemedText>
            </View>
          </View>

          <View style={styles.leadsList}>
            {mockLeads.map((lead) => (
              <View key={lead.id} style={[styles.leadCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
                <View style={styles.leadHeader}>
                  <View style={{ flex: 1 }}>
                    <ThemedText type="subtitle" style={{ fontSize: 15, color: theme.text }}>
                      {lead.clientName}
                    </ThemedText>
                    <ThemedText style={{ fontSize: 12, color: theme.textSecondary, marginTop: 1 }}>
                      {lead.projectType}
                    </ThemedText>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: theme.accentGreenLight }]}>
                    <Text style={[styles.statusText, { color: green }]}>{lead.status}</Text>
                  </View>
                </View>

                <View style={[styles.leadDetailsRow, { borderTopColor: theme.border, borderBottomColor: theme.border }]}>
                  <View style={styles.detailItem}>
                    <Ionicons name="wallet-outline" size={13} color={brown} />
                    <Text style={[styles.detailText, { color: theme.text }]}>{lead.budget}</Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Ionicons name="time-outline" size={13} color={theme.textSecondary} />
                    <Text style={[styles.detailText, { color: theme.textSecondary }]}>{lead.date}</Text>
                  </View>
                </View>

                <View style={styles.leadActions}>
                  <Pressable style={({ pressed }) => [styles.contactBtn, { backgroundColor: green }, pressed && { opacity: 0.9 }]}>
                    <Ionicons name="call" size={14} color="#FFFFFF" />
                    <Text style={styles.contactBtnText}>Call Client ({lead.phone})</Text>
                  </Pressable>

                  <Pressable style={({ pressed }) => [styles.chatBtn, { borderColor: theme.border, backgroundColor: theme.backgroundElement }, pressed && { opacity: 0.8 }]}>
                    <Ionicons name="chatbubble-ellipses-outline" size={14} color={theme.text} />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* TAB CONTENT 2: PORTFOLIO SHOWCASE SECTION */}
      {(activeTab === 'overview' || activeTab === 'projects') && (
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <ThemedText type="smallBold" style={[styles.sectionSubtitle, { color: brown }]}>
                STUDIO PORTFOLIO
              </ThemedText>
              <ThemedText type="subtitle" style={{ fontSize: 18, color: theme.text }}>
                Featured Design Projects
              </ThemedText>
            </View>

            <Pressable style={({ pressed }) => [styles.addProjectBtn, { backgroundColor: brown }, pressed && { opacity: 0.9 }]}>
              <Ionicons name="add" size={16} color="#FFFFFF" />
              <Text style={styles.addProjectBtnText}>+ Add Project</Text>
            </Pressable>
          </View>

          <View style={styles.projectsList}>
            {mockProjects.map((project) => (
              <View key={project.id} style={[styles.projectCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
                <Image source={{ uri: project.image }} style={styles.projectImg} contentFit="cover" />
                <View style={styles.projectBody}>
                  <View style={styles.projectTopRow}>
                    <View style={[styles.categoryTag, { backgroundColor: theme.accentBrownLight }]}>
                      <Text style={[styles.categoryText, { color: brown }]}>{project.category}</Text>
                    </View>
                    <View style={styles.projectStats}>
                      <Ionicons name="eye-outline" size={12} color={theme.textSecondary} />
                      <Text style={[styles.projectStatText, { color: theme.textSecondary }]}>{project.views}</Text>
                      <Ionicons name="heart" size={12} color="#E74C3C" style={{ marginLeft: 6 }} />
                      <Text style={[styles.projectStatText, { color: theme.textSecondary }]}>{project.likes}</Text>
                    </View>
                  </View>

                  <ThemedText type="subtitle" style={{ fontSize: 16, color: theme.text, marginTop: 6 }}>
                    {project.title}
                  </ThemedText>
                  <ThemedText style={{ fontSize: 12, color: theme.textSecondary, marginTop: 2 }}>
                    📍 {project.location}
                  </ThemedText>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* STUDIO SERVICES SECTION */}
      <View style={styles.section}>
        <ThemedText type="smallBold" style={[styles.sectionSubtitle, { color: brown }]}>
          OFFERED SERVICES & PRICING
        </ThemedText>
        <ThemedText type="subtitle" style={{ fontSize: 18, color: theme.text, marginBottom: 10 }}>
          Services Active on Dwellist
        </ThemedText>

        <View style={styles.servicesGrid}>
          <View style={[styles.serviceItem, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
            <Ionicons name="home-outline" size={20} color={brown} />
            <Text style={[styles.serviceTitle, { color: theme.text }]}>Turnkey Interiors</Text>
            <Text style={[styles.serviceRate, { color: green }]}>From ₹850 / sq ft</Text>
          </View>

          <View style={[styles.serviceItem, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
            <Ionicons name="cube-outline" size={20} color={brown} />
            <Text style={[styles.serviceTitle, { color: theme.text }]}>3D Visualization</Text>
            <Text style={[styles.serviceRate, { color: green }]}>From ₹15,000 / room</Text>
          </View>

          <View style={[styles.serviceItem, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
            <Ionicons name="construct-outline" size={20} color={brown} />
            <Text style={[styles.serviceTitle, { color: theme.text }]}>Site Supervision</Text>
            <Text style={[styles.serviceRate, { color: green }]}>Included in Plan</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.four,
    gap: Spacing.four,
    paddingBottom: 40,
  },
  headerCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: Spacing.four,
    gap: 14,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  avatarFallback: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  roleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 4,
  },
  roleTagText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  firmTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  metricCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
  },
  metricIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  tabRow: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 12,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    borderWidth: 1,
  },
  section: {
    gap: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  sectionSubtitle: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  addProjectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  addProjectBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  leadsList: {
    gap: 12,
  },
  leadCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  leadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  leadDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    fontWeight: '600',
  },
  leadActions: {
    flexDirection: 'row',
    gap: 8,
  },
  contactBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 8,
  },
  contactBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  chatBtn: {
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  projectsList: {
    gap: 12,
  },
  projectCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  projectImg: {
    width: '100%',
    height: 160,
  },
  projectBody: {
    padding: 12,
  },
  projectTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
  },
  projectStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  projectStatText: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 3,
  },
  servicesGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  serviceItem: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  serviceTitle: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 2,
  },
  serviceRate: {
    fontSize: 10,
    fontWeight: '700',
  },
});
