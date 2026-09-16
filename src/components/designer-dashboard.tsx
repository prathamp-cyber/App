import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, ScrollView, Pressable, Text, ActivityIndicator, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/context/AuthContext';
import { useAppContext } from '@/context/AppContext';
import { Spacing } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { Designer } from '@/types/designer';
import { mapDbDesignerToDesigner } from '@/hooks/use-designers';

import { DesignerProfileFormModal } from './designer-profile-form-modal';

interface InquiryItem {
  id: string;
  designerId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  propertyType: string;
  budgetRange: string;
  timeline: string;
  message: string;
  status: 'pending' | 'contacted' | 'completed' | 'rejected';
  date: string;
}

export function DesignerDashboard() {
  const theme = useTheme();
  const { user, logout, openProfileModal } = useAuth();
  const { city } = useAppContext();

  const green = theme.primaryGreen;
  const brown = theme.primaryBrown;

  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'profile'>('overview');

  const [designerProfile, setDesignerProfile] = useState<Designer | null>(null);
  const [hasCheckedProfile, setHasCheckedProfile] = useState<boolean>(false);
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFormModalVisible, setFormModalVisible] = useState<boolean>(false);

  // Fetch designer profile row and inquiries for the logged-in designer
  const fetchDashboardData = useCallback(async () => {
    if (!user) {
      setInquiries([]);
      setDesignerProfile(null);
      setLoading(false);
      setHasCheckedProfile(true);
      return;
    }

    setLoading(true);

    try {
      // 1. Fetch designer row from public.designers linked to this user (by user_id or email)
      const { data: dbDesigner, error: designerErr } = await supabase
        .from('designers')
        .select('*')
        .or(`user_id.eq.${user.id},email.eq.${user.email}`)
        .maybeSingle();

      let targetDesignerId: string | null = null;

      if (dbDesigner) {
        const mapped = mapDbDesignerToDesigner(dbDesigner);
        setDesignerProfile(mapped);
        targetDesignerId = dbDesigner.id;
      } else {
        setDesignerProfile(null);
      }

      setHasCheckedProfile(true);

      // 2. Fetch inquiries where designer_id matches designer row, sorted newest first
      if (!targetDesignerId) {
        setInquiries([]);
      } else {
        const { data: dbInquiries, error: inqErr } = await supabase
          .from('inquiries')
          .select('*')
          .eq('designer_id', targetDesignerId)
          .order('created_at', { ascending: false });

        if (inqErr) {
          console.warn('[Dwellist Dashboard] Error fetching inquiries:', inqErr.message);
        }

        if (dbInquiries && dbInquiries.length > 0) {
          const mappedInquiries: InquiryItem[] = dbInquiries.map((inq: any) => ({
            id: inq.id,
            designerId: inq.designer_id,
            clientName: inq.client_name || 'Anonymous Client',
            clientPhone: inq.client_phone || 'N/A',
            clientEmail: inq.client_email || '',
            propertyType: inq.property_type || 'Residential',
            budgetRange: inq.budget_range || 'Standard',
            timeline: inq.timeline || 'Immediate',
            message: inq.message || '',
            status: (inq.status as any) || 'pending',
            date: inq.created_at ? new Date(inq.created_at).toLocaleDateString() : 'Recently',
          }));
          setInquiries(mappedInquiries);
        } else {
          setInquiries([]);
        }
      }
    } catch (err) {
      console.error('[Dwellist Dashboard] Unexpected error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Status update action (pending/contacted/completed/rejected) patching inquiry's status field
  const updateInquiryStatus = async (
    inquiryId: string,
    newStatus: 'pending' | 'contacted' | 'completed' | 'rejected'
  ) => {
    // Optimistic UI state update
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === inquiryId ? { ...inq, status: newStatus } : inq))
    );

    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ status: newStatus })
        .eq('id', inquiryId);

      if (error) {
        console.error('[Dwellist Dashboard] Failed to update inquiry status:', error.message);
        fetchDashboardData();
      }
    } catch (err) {
      console.error('[Dwellist Dashboard] Error updating status:', err);
      fetchDashboardData();
    }
  };

  // Inquiry Status Counts for Dashboard Stats Section
  const pendingCount = inquiries.filter((i) => i.status === 'pending').length;
  const contactedCount = inquiries.filter((i) => i.status === 'contacted').length;
  const completedCount = inquiries.filter((i) => i.status === 'completed').length;
  const rejectedCount = inquiries.filter((i) => i.status === 'rejected').length;

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={green} />
        <ThemedText style={{ marginTop: 12, fontSize: 13 }} themeColor="textSecondary">
          Loading Studio Portal...
        </ThemedText>
      </View>
    );
  }

  // Freshly signed-up designer state (no designers table row yet)
  if (hasCheckedProfile && !designerProfile && inquiries.length === 0) {
    return (
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Card */}
        <View style={[styles.headerCard, { backgroundColor: theme.cardBackground, borderColor: theme.border, shadowColor: theme.cardShadow }]}>
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
            </View>

            <View style={{ flex: 1, marginLeft: 14 }}>
              <View style={[styles.roleTag, { backgroundColor: theme.accentBrownLight }]}>
                <Ionicons name="briefcase" size={11} color={brown} />
                <Text style={[styles.roleTagText, { color: brown }]}>DESIGNER PORTAL</Text>
              </View>

              <ThemedText type="subtitle" style={[styles.firmTitle, { color: theme.text }]}>
                {user?.firmName || `${user?.name || 'Designer'} Studio`}
              </ThemedText>

              <ThemedText style={{ fontSize: 12, color: theme.textSecondary, marginTop: 2 }}>
                Account: {user?.name} ({user?.email})
              </ThemedText>
            </View>
          </View>

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
                Edit Account Info
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

        {/* Empty State Card */}
        <View style={[styles.emptyCard, { backgroundColor: theme.cardBackground, borderColor: theme.border, shadowColor: theme.cardShadow }]}>
          <View style={[styles.emptyIconBg, { backgroundColor: theme.accentBrownLight }]}>
            <Ionicons name="briefcase-outline" size={38} color={brown} />
          </View>
          <ThemedText type="subtitle" style={{ fontSize: 19, marginTop: 14, textAlign: 'center' }}>
            Complete Your Designer Profile
          </ThemedText>
          <ThemedText style={{ textAlign: 'center', marginTop: 6, fontSize: 13, lineHeight: 19 }} themeColor="textSecondary">
            Your studio listing is not yet linked to your account. Set up your firm details, upload project photos, and list your specialties to start receiving client consultation requests on Dwellist.
          </ThemedText>

          <Pressable
            onPress={() => setFormModalVisible(true)}
            style={({ pressed }) => [
              styles.setupBtn,
              { backgroundColor: green },
              pressed && { opacity: 0.9 }
            ]}
          >
            <Ionicons name="sparkles" size={16} color="#FFFFFF" />
            <ThemedText style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 14, marginLeft: 6 }}>
              Set Up Studio Profile
            </ThemedText>
          </Pressable>
        </View>

        {/* Designer Profile Form Modal (Create / Edit) */}
        <DesignerProfileFormModal
          visible={isFormModalVisible}
          designer={designerProfile}
          onClose={() => setFormModalVisible(false)}
          onSuccess={fetchDashboardData}
        />
      </ScrollView>
    );
  }

  const activeDesigner = designerProfile;

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return { bg: theme.accentGreenLight, text: green, label: 'Completed', icon: 'checkmark-circle-outline' as const };
      case 'contacted':
        return { bg: '#EBF5FB', text: '#2980B9', label: 'Contacted', icon: 'call-outline' as const };
      case 'rejected':
        return { bg: '#FDEDEC', text: '#C0392B', label: 'Rejected', icon: 'close-circle-outline' as const };
      default:
        return { bg: theme.accentBrownLight, text: brown, label: 'Pending / New', icon: 'time-outline' as const };
    }
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* 1. Verified Studio Header Card */}
      <View style={[styles.headerCard, { backgroundColor: theme.cardBackground, borderColor: theme.border, shadowColor: theme.cardShadow }]}>
        <View style={styles.headerTop}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: activeDesigner?.avatar || user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop' }}
              style={styles.avatar}
              contentFit="cover"
            />
            <View style={[styles.verifiedBadge, { backgroundColor: brown }]}>
              <Ionicons name="checkmark" size={10} color="#FFFFFF" />
            </View>
          </View>

          <View style={{ flex: 1, marginLeft: 14 }}>
            <View style={[styles.roleTag, { backgroundColor: theme.accentBrownLight }]}>
              <Ionicons name="briefcase" size={11} color={brown} />
              <Text style={[styles.roleTagText, { color: brown }]}>VERIFIED STUDIO PORTAL</Text>
            </View>

            <ThemedText type="subtitle" style={[styles.firmTitle, { color: theme.text }]}>
              {activeDesigner?.firm || user?.firmName || `${user?.name} Studio`}
            </ThemedText>

            <ThemedText style={{ fontSize: 12, color: theme.textSecondary, marginTop: 2 }}>
              Lead: {activeDesigner?.name || user?.name} • {activeDesigner?.city || user?.city || city}, Gujarat
            </ThemedText>
          </View>
        </View>

        {/* Header Action Buttons */}
        <View style={[styles.headerActions, { borderTopColor: theme.border }]}>
          <Pressable
            onPress={() => setFormModalVisible(true)}
            style={({ pressed }) => [
              styles.actionBtnPrimary,
              { backgroundColor: green },
              pressed && { opacity: 0.88 }
            ]}
          >
            <Ionicons name="create-outline" size={15} color="#FFFFFF" />
            <Text style={styles.actionBtnPrimaryText}>
              Edit Studio Profile
            </Text>
          </Pressable>

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
              Account
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

      {/* 2. Stat Metric Cards (2x2 Grid) */}
      <View style={styles.metricsGrid}>
        {/* Card 1: Total leads */}
        <View style={[styles.metricCard, { backgroundColor: theme.cardBackground, borderColor: theme.border, shadowColor: theme.cardShadow }]}>
          <View style={[styles.metricIconBg, { backgroundColor: theme.accentGreenLight }]}>
            <Ionicons name="chatbubbles-outline" size={18} color={green} />
          </View>
          <ThemedText type="subtitle" style={[styles.metricValue, { color: theme.text }]}>
            {inquiries.length}
          </ThemedText>
          <ThemedText style={styles.metricLabel} themeColor="textSecondary">
            Total leads
          </ThemedText>
        </View>

        {/* Card 2: Pending */}
        <View style={[styles.metricCard, { backgroundColor: theme.cardBackground, borderColor: theme.border, shadowColor: theme.cardShadow }]}>
          <View style={[styles.metricIconBg, { backgroundColor: theme.accentBrownLight }]}>
            <Ionicons name="time-outline" size={18} color={brown} />
          </View>
          <ThemedText type="subtitle" style={[styles.metricValue, { color: theme.text }]}>
            {pendingCount}
          </ThemedText>
          <ThemedText style={styles.metricLabel} themeColor="textSecondary">
            Pending
          </ThemedText>
        </View>

        {/* Card 3: Avg rating */}
        <View style={[styles.metricCard, { backgroundColor: theme.cardBackground, borderColor: theme.border, shadowColor: theme.cardShadow }]}>
          <View style={[styles.metricIconBg, { backgroundColor: theme.accentGreenLight }]}>
            <Ionicons name="star" size={18} color="#D4AF37" />
          </View>
          <ThemedText type="subtitle" style={[styles.metricValue, { color: theme.text }]}>
            {activeDesigner?.rating ? Number(activeDesigner.rating).toFixed(1) : '5.0'}
          </ThemedText>
          <ThemedText style={styles.metricLabel} themeColor="textSecondary">
            Avg rating
          </ThemedText>
        </View>

        {/* Card 4: Projects */}
        <View style={[styles.metricCard, { backgroundColor: theme.cardBackground, borderColor: theme.border, shadowColor: theme.cardShadow }]}>
          <View style={[styles.metricIconBg, { backgroundColor: theme.accentBrownLight }]}>
            <Ionicons name="trophy-outline" size={18} color={brown} />
          </View>
          <ThemedText type="subtitle" style={[styles.metricValue, { color: theme.text }]}>
            {activeDesigner?.completedProjects ? `${activeDesigner.completedProjects}+` : '0+'}
          </ThemedText>
          <ThemedText style={styles.metricLabel} themeColor="textSecondary">
            Projects
          </ThemedText>
        </View>
      </View>

      {/* 3. Segmented Tab Navigation Control */}
      <View style={[styles.segmentedTabContainer, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
        <Pressable
          onPress={() => setActiveTab('overview')}
          style={[
            styles.segmentedTabBtn,
            activeTab === 'overview' && [
              styles.segmentedTabActive,
              { backgroundColor: theme.cardBackground, borderColor: theme.border, shadowColor: theme.cardShadow }
            ]
          ]}
        >
          <Ionicons
            name="grid-outline"
            size={14}
            color={activeTab === 'overview' ? green : theme.textSecondary}
          />
          <Text style={[styles.segmentedTabText, { color: activeTab === 'overview' ? green : theme.textSecondary }]}>
            Overview
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('leads')}
          style={[
            styles.segmentedTabBtn,
            activeTab === 'leads' && [
              styles.segmentedTabActive,
              { backgroundColor: theme.cardBackground, borderColor: theme.border, shadowColor: theme.cardShadow }
            ]
          ]}
        >
          <Ionicons
            name="chatbubbles-outline"
            size={14}
            color={activeTab === 'leads' ? green : theme.textSecondary}
          />
          <Text style={[styles.segmentedTabText, { color: activeTab === 'leads' ? green : theme.textSecondary }]}>
            Leads
          </Text>
          {inquiries.length > 0 && (
            <View style={[styles.badgePill, { backgroundColor: activeTab === 'leads' ? green : theme.border }]}>
              <Text style={[styles.badgePillText, { color: activeTab === 'leads' ? '#FFFFFF' : theme.text }]}>
                {inquiries.length}
              </Text>
            </View>
          )}
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('profile')}
          style={[
            styles.segmentedTabBtn,
            activeTab === 'profile' && [
              styles.segmentedTabActive,
              { backgroundColor: theme.cardBackground, borderColor: theme.border, shadowColor: theme.cardShadow }
            ]
          ]}
        >
          <Ionicons
            name="eye-outline"
            size={14}
            color={activeTab === 'profile' ? green : theme.textSecondary}
          />
          <Text style={[styles.segmentedTabText, { color: activeTab === 'profile' ? green : theme.textSecondary }]}>
            Listing Profile
          </Text>
        </Pressable>
      </View>

      {/* TAB 1: OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <ThemedText type="smallBold" style={[styles.sectionSubtitle, { color: brown }]}>
                RECENT CONSULTATIONS
              </ThemedText>
              <ThemedText type="subtitle" style={{ fontSize: 18, color: theme.text }}>
                Latest Requests
              </ThemedText>
            </View>
            <Pressable onPress={() => setActiveTab('leads')} style={styles.viewAllBtn}>
              <Text style={{ fontSize: 13, color: green, fontWeight: '700' }}>
                View all
              </Text>
              <Ionicons name="chevron-forward" size={14} color={green} />
            </Pressable>
          </View>

          {inquiries.length > 0 ? (
            <View style={styles.leadsList}>
              {inquiries.slice(0, 3).map((lead) => {
                const statusInfo = getStatusBadgeStyle(lead.status);
                return (
                  <View key={lead.id} style={[styles.leadCard, { backgroundColor: theme.cardBackground, borderColor: theme.border, shadowColor: theme.cardShadow }]}>
                    <View style={styles.leadHeader}>
                      <View style={{ flex: 1 }}>
                        <ThemedText type="subtitle" style={{ fontSize: 16, color: theme.text }}>
                          {lead.clientName}
                        </ThemedText>
                        <ThemedText style={{ fontSize: 12, color: theme.textSecondary, marginTop: 2 }}>
                          {lead.propertyType} Project • {lead.budgetRange}
                        </ThemedText>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
                        <Ionicons name={statusInfo.icon} size={12} color={statusInfo.text} />
                        <Text style={[styles.statusText, { color: statusInfo.text }]}>
                          {statusInfo.label}
                        </Text>
                      </View>
                    </View>

                    {lead.message ? (
                      <View style={[styles.messageCallout, { backgroundColor: theme.backgroundElement, borderLeftColor: brown }]}>
                        <ThemedText style={styles.messageText} themeColor="textSecondary">
                          "{lead.message}"
                        </ThemedText>
                      </View>
                    ) : null}

                    {/* Status Patch Pills */}
                    <View style={styles.statusPatchContainer}>
                      <Text style={styles.patchLabel}>Status Transition:</Text>
                      <View style={styles.patchPillsRow}>
                        {(['pending', 'contacted', 'completed', 'rejected'] as const).map((st) => {
                          const isActive = lead.status === st;
                          return (
                            <Pressable
                              key={st}
                              onPress={() => updateInquiryStatus(lead.id, st)}
                              style={[
                                styles.statusPillBtn,
                                {
                                  backgroundColor: isActive ? green : theme.backgroundElement,
                                  borderColor: isActive ? green : theme.border,
                                }
                              ]}
                            >
                              <Text style={{ fontSize: 11, fontWeight: '700', color: isActive ? '#FFFFFF' : theme.textSecondary }}>
                                {st.charAt(0).toUpperCase() + st.slice(1)}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={[styles.emptyCard, { backgroundColor: theme.cardBackground, borderColor: theme.border, shadowColor: theme.cardShadow, paddingVertical: 28 }]}>
              <Ionicons name="chatbubbles-outline" size={32} color={theme.textSecondary} />
              <ThemedText style={{ fontSize: 14, marginTop: 8 }} themeColor="textSecondary">
                No recent consultation inquiries yet.
              </ThemedText>
            </View>
          )}
        </View>
      )}

      {/* TAB 2: LEADS TAB */}
      {activeTab === 'leads' && (
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <ThemedText type="smallBold" style={[styles.sectionSubtitle, { color: brown }]}>
                CLIENT LEADS PIPELINE
              </ThemedText>
              <ThemedText type="subtitle" style={{ fontSize: 18, color: theme.text }}>
                Inquiries Received ({inquiries.length})
              </ThemedText>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <ThemedText style={{ fontSize: 11, fontWeight: '700', color: green }}>
                Pending: {pendingCount} • Contacted: {contactedCount}
              </ThemedText>
              <ThemedText style={{ fontSize: 10, color: theme.textSecondary, marginTop: 2 }}>
                Completed: {completedCount} • Rejected: {rejectedCount}
              </ThemedText>
            </View>
          </View>

          {/* List of inquiries cards or Empty State UI */}
          {inquiries.length > 0 ? (
            <View style={styles.leadsList}>
              {inquiries.map((lead) => {
                const statusInfo = getStatusBadgeStyle(lead.status);

                return (
                  <View key={lead.id} style={[styles.leadCard, { backgroundColor: theme.cardBackground, borderColor: theme.border, shadowColor: theme.cardShadow }]}>
                    <View style={styles.leadHeader}>
                      <View style={{ flex: 1 }}>
                        <ThemedText type="subtitle" style={{ fontSize: 17, color: theme.text }}>
                          {lead.clientName}
                        </ThemedText>
                        <ThemedText style={{ fontSize: 12, color: theme.textSecondary, marginTop: 2 }}>
                          {lead.propertyType} Project • Budget: {lead.budgetRange}
                        </ThemedText>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
                        <Ionicons name={statusInfo.icon} size={12} color={statusInfo.text} />
                        <Text style={[styles.statusText, { color: statusInfo.text }]}>{statusInfo.label}</Text>
                      </View>
                    </View>

                    {lead.message ? (
                      <View style={[styles.messageCallout, { backgroundColor: theme.backgroundElement, borderLeftColor: brown }]}>
                        <ThemedText style={styles.messageText} themeColor="textSecondary">
                          "{lead.message}"
                        </ThemedText>
                      </View>
                    ) : null}

                    <View style={[styles.leadDetailsRow, { borderTopColor: theme.border, borderBottomColor: theme.border }]}>
                      <View style={styles.detailItem}>
                        <Ionicons name="call-outline" size={14} color={brown} />
                        <Text style={[styles.detailText, { color: theme.text }]}>{lead.clientPhone}</Text>
                      </View>

                      {lead.clientEmail ? (
                        <View style={styles.detailItem}>
                          <Ionicons name="mail-outline" size={14} color={theme.textSecondary} />
                          <Text style={[styles.detailText, { color: theme.textSecondary }]}>{lead.clientEmail}</Text>
                        </View>
                      ) : null}

                      <View style={styles.detailItem}>
                        <Ionicons name="calendar-outline" size={14} color={theme.textSecondary} />
                        <Text style={[styles.detailText, { color: theme.textSecondary }]}>{lead.date}</Text>
                      </View>
                    </View>

                    {/* Interactive Status Patching Pills */}
                    <View style={styles.statusPatchContainer}>
                      <Text style={styles.patchLabel}>Update Status:</Text>
                      <View style={styles.patchPillsRow}>
                        {(['pending', 'contacted', 'completed', 'rejected'] as const).map((st) => {
                          const isActive = lead.status === st;
                          return (
                            <Pressable
                              key={st}
                              onPress={() => updateInquiryStatus(lead.id, st)}
                              style={[
                                styles.statusPillBtn,
                                {
                                  backgroundColor: isActive ? green : theme.backgroundElement,
                                  borderColor: isActive ? green : theme.border,
                                }
                              ]}
                            >
                              <Text
                                style={{
                                  fontSize: 11,
                                  fontWeight: '700',
                                  color: isActive ? '#FFFFFF' : theme.textSecondary,
                                }}
                              >
                                {st.charAt(0).toUpperCase() + st.slice(1)}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </View>

                    <View style={styles.leadActions}>
                      <Pressable
                        onPress={() => Linking.openURL(`tel:${lead.clientPhone}`).catch(() => {})}
                        style={({ pressed }) => [styles.contactBtn, { backgroundColor: green }, pressed && { opacity: 0.9 }]}
                      >
                        <Ionicons name="call" size={14} color="#FFFFFF" />
                        <Text style={styles.contactBtnText}>Call Client ({lead.clientPhone})</Text>
                      </Pressable>

                      {lead.clientEmail ? (
                        <Pressable
                          onPress={() => Linking.openURL(`mailto:${lead.clientEmail}`).catch(() => {})}
                          style={({ pressed }) => [styles.emailBtn, { backgroundColor: theme.backgroundElement, borderColor: theme.border }, pressed && { opacity: 0.8 }]}
                        >
                          <Ionicons name="mail" size={14} color={theme.text} />
                          <Text style={[styles.emailBtnText, { color: theme.text }]}>Email</Text>
                        </Pressable>
                      ) : null}
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            /* Empty-state UI ("No leads yet") */
            <View style={[styles.emptyCard, { backgroundColor: theme.cardBackground, borderColor: theme.border, shadowColor: theme.cardShadow, paddingVertical: 36 }]}>
              <View style={[styles.emptyIconBg, { backgroundColor: theme.accentBrownLight }]}>
                <Ionicons name="chatbubbles-outline" size={38} color={brown} />
              </View>
              <ThemedText type="subtitle" style={{ fontSize: 17, marginTop: 14 }}>
                No leads yet
              </ThemedText>
              <ThemedText style={{ textAlign: 'center', marginTop: 4, fontSize: 13, lineHeight: 18 }} themeColor="textSecondary">
                When prospective clients submit consultation inquiries for your studio profile, they will appear here.
              </ThemedText>
            </View>
          )}
        </View>
      )}

      {/* TAB 3: READ-ONLY PROFILE TAB PREVIEW (MIRRORS CLIENT-FACING DETAIL VIEW) */}
      {activeTab === 'profile' && activeDesigner && (
        <View style={styles.section}>
          {/* Read-Only Banner with Edit Action */}
          <View style={[styles.readOnlyBanner, { backgroundColor: theme.accentBrownLight, borderColor: theme.border }]}>
            <Ionicons name="eye" size={16} color={brown} />
            <ThemedText style={{ fontSize: 13, color: brown, fontWeight: '700', flex: 1 }}>
              Client Listing Preview (Live View)
            </ThemedText>
            <Pressable
              onPress={() => setFormModalVisible(true)}
              style={({ pressed }) => [
                styles.editListingBannerBtn,
                { backgroundColor: green },
                pressed && { opacity: 0.88 }
              ]}
            >
              <Ionicons name="create-outline" size={13} color="#FFFFFF" />
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#FFFFFF' }}>Edit Studio Profile</Text>
            </Pressable>
          </View>

          {/* Profile Card Preview matching DesignerCard & DesignerDetailModal layout */}
          <View style={[styles.profilePreviewCard, { backgroundColor: theme.cardBackground, borderColor: theme.border, shadowColor: theme.cardShadow }]}>
            {/* Cover Banner */}
            <View style={styles.previewCoverWrapper}>
              <Image source={{ uri: activeDesigner.coverImage }} style={styles.previewCover} contentFit="cover" />
              
              {/* Rating Badge Overlay */}
              <View style={[styles.ratingBadgeOverlay, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
                <Ionicons name="star" size={13} color="#D4AF37" />
                <Text style={[styles.ratingBadgeText, { color: theme.text }]}>
                  {activeDesigner.rating} ★
                </Text>
              </View>
            </View>

            <View style={styles.previewContent}>
              <View style={styles.previewAvatarRow}>
                <Image source={{ uri: activeDesigner.avatar }} style={styles.previewAvatar} contentFit="cover" />
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <ThemedText type="subtitle" style={{ fontSize: 20, color: green }}>
                    {activeDesigner.firm}
                  </ThemedText>
                  <ThemedText style={{ fontSize: 13, color: theme.textSecondary, marginTop: 1 }}>
                    Principal Lead: {activeDesigner.name}
                  </ThemedText>
                </View>
              </View>

              {/* Stats Bar */}
              <View style={[styles.previewStatRow, { backgroundColor: theme.backgroundElement }]}>
                <View style={{ alignItems: 'center' }}>
                  <ThemedText type="smallBold" style={{ color: green, fontSize: 15 }}>{activeDesigner.rating} ★</ThemedText>
                  <ThemedText style={{ fontSize: 10, marginTop: 2 }} themeColor="textSecondary">AVERAGE RATING</ThemedText>
                </View>
                <View style={{ width: 1, height: 24, backgroundColor: theme.border }} />
                <View style={{ alignItems: 'center' }}>
                  <ThemedText type="smallBold" style={{ fontSize: 15 }}>{activeDesigner.experience} Yrs</ThemedText>
                  <ThemedText style={{ fontSize: 10, marginTop: 2 }} themeColor="textSecondary">EXPERIENCE</ThemedText>
                </View>
                <View style={{ width: 1, height: 24, backgroundColor: theme.border }} />
                <View style={{ alignItems: 'center' }}>
                  <ThemedText type="smallBold" style={{ fontSize: 15 }}>{activeDesigner.completedProjects}+</ThemedText>
                  <ThemedText style={{ fontSize: 10, marginTop: 2 }} themeColor="textSecondary">PROJECTS</ThemedText>
                </View>
              </View>

              {/* Location & Details */}
              <View style={{ gap: 8, marginTop: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Ionicons name="location" size={15} color={brown} />
                  <ThemedText style={{ fontSize: 13, fontWeight: '600' }} themeColor="textSecondary">
                    {activeDesigner.address || `${activeDesigner.area}, ${activeDesigner.city}`}
                  </ThemedText>
                </View>

                {activeDesigner.description ? (
                  <View style={[styles.descriptionBox, { backgroundColor: theme.backgroundElement }]}>
                    <ThemedText style={{ fontSize: 13, lineHeight: 19 }} themeColor="textSecondary">
                      {activeDesigner.description}
                    </ThemedText>
                  </View>
                ) : null}
              </View>

              {/* Specialties */}
              {activeDesigner.specialties && activeDesigner.specialties.length > 0 && (
                <View style={{ marginTop: 14 }}>
                  <ThemedText type="smallBold" style={{ fontSize: 12, color: brown, marginBottom: 8, letterSpacing: 0.5 }}>
                    SPECIALTY STYLES & SERVICES
                  </ThemedText>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {activeDesigner.specialties.map((spec, idx) => (
                      <View key={idx} style={[styles.specPill, { backgroundColor: theme.accentBrownLight }]}>
                        <Text style={{ fontSize: 11, fontWeight: '700', color: brown }}>{spec}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Portfolio Images */}
              {activeDesigner.portfolio && activeDesigner.portfolio.length > 0 && (
                <View style={{ marginTop: 16 }}>
                  <ThemedText type="smallBold" style={{ fontSize: 12, color: brown, marginBottom: 8, letterSpacing: 0.5 }}>
                    PORTFOLIO GALLERY SHOWCASE ({activeDesigner.portfolio.length})
                  </ThemedText>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                    {activeDesigner.portfolio.map((img, idx) => (
                      <Image key={idx} source={{ uri: img }} style={styles.portfolioThumb} contentFit="cover" />
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>
        </View>
      )}

      {/* Designer Profile Form Modal (Create / Edit) */}
      <DesignerProfileFormModal
        visible={isFormModalVisible}
        designer={designerProfile}
        onClose={() => setFormModalVisible(false)}
        onSuccess={fetchDashboardData}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.four,
    gap: Spacing.four,
    paddingBottom: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.six,
  },
  headerCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: Spacing.four,
    gap: 14,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
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
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
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
    fontSize: 19,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 14,
    borderTopWidth: 1,
  },
  actionBtnPrimary: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  actionBtnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  metricCard: {
    width: '48.5%',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    alignItems: 'flex-start',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  metricIconBg: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 26,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  segmentedTabContainer: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
  },
  segmentedTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
  },
  segmentedTabActive: {
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentedTabText: {
    fontSize: 12,
    fontWeight: '700',
  },
  badgePill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  badgePillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  section: {
    gap: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
    paddingHorizontal: 6,
    flexShrink: 0,
  },
  leadsList: {
    gap: 14,
  },
  leadCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  leadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  messageCallout: {
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
  },
  messageText: {
    fontSize: 12,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  leadDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    flexWrap: 'wrap',
    gap: 8,
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
    gap: 10,
  },
  contactBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  contactBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  emailBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  emailBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusPatchContainer: {
    gap: 6,
    marginTop: 2,
  },
  patchLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#80848C',
    letterSpacing: 0.8,
  },
  patchPillsRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  statusPillBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  emptyCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: Spacing.four,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyIconBg: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setupBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
  },
  readOnlyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  editListingBannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  profilePreviewCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  previewCoverWrapper: {
    position: 'relative',
    height: 160,
  },
  previewCover: {
    width: '100%',
    height: '100%',
  },
  ratingBadgeOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  ratingBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  previewContent: {
    padding: 16,
  },
  previewAvatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  previewStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 14,
  },
  descriptionBox: {
    padding: 12,
    borderRadius: 10,
  },
  specPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  portfolioThumb: {
    width: 130,
    height: 94,
    borderRadius: 10,
  },
});
