import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCurrentUser } from '@/modules/auth/AuthProvider';
import { api } from '@workspace/backend/convex/_generated/api';
import type { Doc } from '@workspace/backend/convex/_generated/dataModel';
import { useSessionQuery } from 'convex-helpers/react/sessions';
import {
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  MoreVertical,
  UserPlus,
  X,
  XCircle,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { AttendanceDialog } from './AttendanceDialog';
import { AttendanceEmptyState } from './AttendanceEmptyState';

/**
 * Props for the Attendance component.
 */
export interface AttendanceModuleProps {
  attendanceKey: string;
  title: string;
  expectedNames?: string[];
  remarksPlaceholder?: string;
}

/**
 * Configuration options for copying attendance data.
 */
interface _CopyOptions {
  includeRemarks: boolean;
  groupByStatus: boolean;
}

// Internal component that uses useSearchParams
const AttendanceContent = ({
  attendanceKey,
  title = 'Attendance',
  expectedNames = [],
  remarksPlaceholder,
}: AttendanceModuleProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentUser = useCurrentUser();
  const isAuthenticated = currentUser !== undefined;
  const [expanded, setExpanded] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFullListModal, setShowFullListModal] = useState(false);
  const [modalSearchQuery, setModalSearchQuery] = useState('');
  const [isManualJoin, setIsManualJoin] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'attending' | 'not_attending'>('all');
  const [copySuccess, setCopySuccess] = useState(false);
  const [showCopyDialog, setShowCopyDialog] = useState(false);
  const [copyOptions, setCopyOptions] = useState<_CopyOptions>({
    includeRemarks: false,
    groupByStatus: true,
  });
  const attendanceData = useSessionQuery(api.attendance.getAttendanceData, {
    attendanceKey,
  });

  // Get attendance tab from URL or default
  const attendanceTabFromUrl = searchParams.get('attendanceTab');

  const [activeTab, setActiveTab] = useState<'pending' | 'responded'>(() => {
    if (attendanceTabFromUrl === 'pending' || attendanceTabFromUrl === 'responded') {
      return attendanceTabFromUrl;
    }
    // Fallback to default based on data only if no tab in URL
    if (attendanceData !== undefined && !_getCurrentUserResponse(attendanceData)) {
      return 'pending';
    }
    return 'responded';
  });

  // Memoized computed values
  const attendanceRecords = useMemo(() => attendanceData?.records || [], [attendanceData?.records]);
  const currentUserResponse = useMemo(
    () => _getCurrentUserResponse(attendanceData),
    [attendanceData]
  );

  // Create a map of names to their attendance records
  const attendanceMap = useMemo(() => {
    const map = new Map<string, Doc<'attendanceRecords'>>();
    for (const record of attendanceRecords) {
      if (record.name) {
        map.set(record.name, record);
      }
    }
    return map;
  }, [attendanceRecords]);

  // Prepare the combined list of names (expected + recorded)
  const allNames = useMemo(() => {
    const names = new Set<string>();

    // Add expected names
    if (expectedNames) {
      for (const name of expectedNames) {
        names.add(name);
      }
    }

    // Add recorded names
    for (const record of attendanceRecords) {
      if (record.name) {
        names.add(record.name);
      }
    }

    return names;
  }, [expectedNames, attendanceRecords]);

  // Convert set to array and filter by search query for main lists
  const filteredNames = useMemo(() => {
    return Array.from(allNames).filter((name) =>
      name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allNames, searchQuery]);

  // Separate names into pending and responded
  const pendingNames = useMemo(() => {
    return filteredNames.filter((name) => {
      const record = attendanceMap.get(name);
      return !record?.status;
    });
  }, [filteredNames, attendanceMap]);

  const respondedNames = useMemo(() => {
    return filteredNames.filter((name) => {
      const record = attendanceMap.get(name);
      return record?.status;
    });
  }, [filteredNames, attendanceMap]);

  // Apply status filter to responded names
  const filteredRespondedNames = useMemo(() => {
    return respondedNames.filter((name) => {
      if (statusFilter === 'all') return true;
      const record = attendanceMap.get(name);
      return record?.status === statusFilter;
    });
  }, [respondedNames, statusFilter, attendanceMap]);

  // Get the names to display based on active tab
  const displayNames = useMemo(() => {
    return activeTab === 'pending' ? pendingNames : filteredRespondedNames;
  }, [activeTab, pendingNames, filteredRespondedNames]);

  // For the modal, we want to keep a separate list filtered by modalSearchQuery
  const modalFilteredNames = useMemo(() => {
    return Array.from(allNames).filter((name) => {
      // If we're in the modal, use the activeTab to determine which list to show
      const record = attendanceMap.get(name);
      const isInActiveTabList = activeTab === 'pending' ? !record?.status : record?.status;

      // Apply status filter for responded tab in modal
      if (activeTab === 'responded' && statusFilter !== 'all') {
        if (record?.status !== statusFilter) return false;
      }

      // Then filter by the modal search query
      return isInActiveTabList && name.toLowerCase().includes(modalSearchQuery.toLowerCase());
    });
  }, [allNames, activeTab, statusFilter, modalSearchQuery, attendanceMap]);

  // Calculate counts
  const attendingCount = useMemo(() => {
    return attendanceRecords.filter((r) => r.status === 'attending').length;
  }, [attendanceRecords]);

  const notAttendingCount = useMemo(() => {
    return attendanceRecords.filter((r) => r.status === 'not_attending').length;
  }, [attendanceRecords]);

  const pendingCount = useMemo(() => pendingNames.length, [pendingNames.length]);

  // Filter counts for responded names (after search but before status filter)
  const respondedAttendingCount = useMemo(() => {
    return respondedNames.filter((name) => {
      const record = attendanceMap.get(name);
      return record?.status === 'attending';
    }).length;
  }, [respondedNames, attendanceMap]);

  const respondedNotAttendingCount = useMemo(() => {
    return respondedNames.filter((name) => {
      const record = attendanceMap.get(name);
      return record?.status === 'not_attending';
    }).length;
  }, [respondedNames, attendanceMap]);

  // Check if the current user is already in the attendance list
  const isCurrentUserRegistered = useMemo(() => {
    return Boolean(currentUserResponse);
  }, [currentUserResponse]);

  /**
   * Update URL when tab changes.
   */
  const handleTabChange = useCallback(
    (tab: 'pending' | 'responded') => {
      setActiveTab(tab);
      // Reset status filter when switching tabs
      setStatusFilter('all');
      const params = new URLSearchParams(searchParams.toString());
      params.set('attendanceTab', tab);
      // Keep the main tab parameter if it exists
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  /**
   * Handle successful attendance submission.
   */
  const handleAttendanceSuccess = useCallback(() => {
    // Switch to responded tab after successful attendance submission
    handleTabChange('responded');
  }, [handleTabChange]);

  /**
   * Handle joining the attendance list.
   */
  const handleJoin = useCallback(() => {
    // If user is authenticated, pre-fill their name, otherwise open with empty name
    const defaultName = isAuthenticated && currentUser ? currentUser.name : '';
    setSelectedPerson(defaultName);
    setIsManualJoin(true); // Always true when using the join button
    setDialogOpen(true);
  }, [isAuthenticated, currentUser]);

  /**
   * Toggle expand state for a name.
   */
  const toggleExpand = useCallback(
    (name: string) => {
      setExpanded(expanded === name ? null : name);
    },
    [expanded]
  );

  /**
   * Handle clicking on a person's name.
   */
  const handlePersonClick = useCallback(
    (name: string) => {
      setSelectedPerson(name);
      // If the name is not in the expected list, consider it a manual join
      // This handles cases where someone manually added themselves but we're now clicking on their name
      const wasInExpectedList = expectedNames?.includes(name);
      setIsManualJoin(!wasInExpectedList);
      setDialogOpen(true);
    },
    [expectedNames]
  );

  /**
   * Handle closing the attendance dialog.
   */
  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
    setSelectedPerson('');
    setIsManualJoin(false);
  }, []);

  /**
   * Fallback copy method using the legacy approach with textarea element.
   */
  const fallbackCopyToClipboard = useCallback((text: string): boolean => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (error) {
      console.error('Fallback copy failed:', error);
      return false;
    }
  }, []);

  /**
   * Handle copy functionality with configuration.
   */
  const handleCopyAttendanceData = useCallback(async () => {
    try {
      // Get all names for the current tab (not filtered by search)
      const allNamesArray = Array.from(allNames);

      let copyText = `${title}\n`;
      copyText += `Generated on: ${new Date().toLocaleString()}\n\n`;

      if (activeTab === 'pending') {
        const pendingNames = allNamesArray.filter((name) => {
          const record = attendanceMap.get(name);
          return !record?.status;
        });

        copyText += `Pending Responses (${pendingNames.length}):\n`;
        copyText += pendingNames.map((name, index) => `${index + 1}. ${name}`).join('\n');
      } else {
        // For responded tab, get names based on status filter
        const respondedNames = allNamesArray.filter((name) => {
          const record = attendanceMap.get(name);
          if (!record?.status) return false;
          if (statusFilter === 'all') return true;
          return record?.status === statusFilter;
        });

        if (copyOptions.groupByStatus && statusFilter === 'all') {
          // Group by attendance status
          const attendingNames = respondedNames.filter((name) => {
            const record = attendanceMap.get(name);
            return record?.status === 'attending';
          });

          const notAttendingNames = respondedNames.filter((name) => {
            const record = attendanceMap.get(name);
            return record?.status === 'not_attending';
          });

          // Attending section
          if (attendingNames.length > 0) {
            copyText += `✓ Attending (${attendingNames.length}):\n`;
            copyText += attendingNames
              .map((name, index) => {
                const record = attendanceMap.get(name);
                let line = `${index + 1}. ${name}`;

                if (copyOptions.includeRemarks && record?.remarks) {
                  line += `\n   Remarks: ${record.remarks}`;
                }

                return line;
              })
              .join('\n');
            copyText += '\n\n';
          }

          // Not attending section
          if (notAttendingNames.length > 0) {
            copyText += `✗ Not Attending (${notAttendingNames.length}):\n`;
            copyText += notAttendingNames
              .map((name, index) => {
                const record = attendanceMap.get(name);
                let line = `${index + 1}. ${name}`;

                if (copyOptions.includeRemarks && record?.reason) {
                  line += `\n   Reason: ${record.reason}`;
                }

                return line;
              })
              .join('\n');
          }
        } else {
          // Single list format
          const statusTitle =
            statusFilter === 'all'
              ? 'All Responses'
              : statusFilter === 'attending'
                ? 'Attending Responses'
                : 'Not Attending Responses';

          copyText += `${statusTitle} (${respondedNames.length}):\n`;

          copyText += respondedNames
            .map((name, index) => {
              const record = attendanceMap.get(name);
              const status = record?.status;
              const statusIcon = status === 'attending' ? '✓' : '✗';

              let line = `${index + 1}. ${name} [${statusIcon}]`;

              // Add reason or remarks if option is enabled
              if (copyOptions.includeRemarks) {
                if (status === 'attending' && record?.remarks) {
                  line += `\n   Remarks: ${record.remarks}`;
                } else if (status === 'not_attending' && record?.reason) {
                  line += `\n   Reason: ${record.reason}`;
                }
              }

              return line;
            })
            .join('\n');
        }
      }

      // Try modern clipboard API first, then fallback to legacy method
      let copySuccessful = false;

      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(copyText);
          copySuccessful = true;
        } catch (clipboardError) {
          console.warn('Modern clipboard API failed, trying fallback:', clipboardError);
          copySuccessful = fallbackCopyToClipboard(copyText);
        }
      } else {
        // Use fallback method directly if modern API is not available
        copySuccessful = fallbackCopyToClipboard(copyText);
      }

      if (copySuccessful) {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } else {
        // Show error message to user
        console.error('All copy methods failed');
        alert(
          'Failed to copy text to clipboard. Please try selecting and copying the preview text manually.'
        );
      }
    } catch (error) {
      console.error('Failed to copy text: ', error);
      alert('Failed to copy text to clipboard. Please try again.');
    }
  }, [
    title,
    activeTab,
    allNames,
    attendanceMap,
    statusFilter,
    copyOptions,
    fallbackCopyToClipboard,
  ]);

  /**
   * Generate the full text that will be copied (same logic as handleCopyAttendanceData).
   */
  const generatePreviewText = useCallback(() => {
    const allNamesArray = Array.from(allNames);

    let copyText = `${title}\n`;
    copyText += `Generated on: ${new Date().toLocaleString()}\n\n`;

    if (activeTab === 'pending') {
      const pendingNames = allNamesArray.filter((name) => {
        const record = attendanceMap.get(name);
        return !record?.status;
      });

      copyText += `Pending Responses (${pendingNames.length}):\n`;
      copyText += pendingNames.map((name, index) => `${index + 1}. ${name}`).join('\n');
    } else {
      // For responded tab, get names based on status filter
      const respondedNames = allNamesArray.filter((name) => {
        const record = attendanceMap.get(name);
        if (!record?.status) return false;
        if (statusFilter === 'all') return true;
        return record?.status === statusFilter;
      });

      if (copyOptions.groupByStatus && statusFilter === 'all') {
        // Group by attendance status
        const attendingNames = respondedNames.filter((name) => {
          const record = attendanceMap.get(name);
          return record?.status === 'attending';
        });

        const notAttendingNames = respondedNames.filter((name) => {
          const record = attendanceMap.get(name);
          return record?.status === 'not_attending';
        });

        // Attending section
        if (attendingNames.length > 0) {
          copyText += `✓ Attending (${attendingNames.length}):\n`;
          copyText += attendingNames
            .map((name, index) => {
              const record = attendanceMap.get(name);
              let line = `${index + 1}. ${name}`;

              if (copyOptions.includeRemarks && record?.remarks) {
                line += `\n   Remarks: ${record.remarks}`;
              }

              return line;
            })
            .join('\n');
          copyText += '\n\n';
        }

        // Not attending section
        if (notAttendingNames.length > 0) {
          copyText += `✗ Not Attending (${notAttendingNames.length}):\n`;
          copyText += notAttendingNames
            .map((name, index) => {
              const record = attendanceMap.get(name);
              let line = `${index + 1}. ${name}`;

              if (copyOptions.includeRemarks && record?.reason) {
                line += `\n   Reason: ${record.reason}`;
              }

              return line;
            })
            .join('\n');
        }
      } else {
        // Single list format
        const statusTitle =
          statusFilter === 'all'
            ? 'All Responses'
            : statusFilter === 'attending'
              ? 'Attending Responses'
              : 'Not Attending Responses';

        copyText += `${statusTitle} (${respondedNames.length}):\n`;

        copyText += respondedNames
          .map((name, index) => {
            const record = attendanceMap.get(name);
            const status = record?.status;
            const statusIcon = status === 'attending' ? '✓' : '✗';

            let line = `${index + 1}. ${name} [${statusIcon}]`;

            // Add reason or remarks if option is enabled
            if (copyOptions.includeRemarks) {
              if (status === 'attending' && record?.remarks) {
                line += `\n   Remarks: ${record.remarks}`;
              } else if (status === 'not_attending' && record?.reason) {
                line += `\n   Reason: ${record.reason}`;
              }
            }

            return line;
          })
          .join('\n');
      }
    }

    return copyText;
  }, [allNames, activeTab, attendanceMap, title, statusFilter, copyOptions]);

  // Effect to update active tab based on URL changes (if not triggered by internal click)
  useEffect(() => {
    const tabFromUrl = searchParams.get('attendanceTab');
    if (tabFromUrl === 'pending' || tabFromUrl === 'responded') {
      setActiveTab(tabFromUrl);
    } else if (attendanceData !== undefined && !currentUserResponse) {
      // Set to pending only if no tab in URL and user hasn't responded
      setActiveTab('pending');
    } else {
      setActiveTab('responded');
    }
  }, [searchParams, attendanceData, currentUserResponse]); // Depend on searchParams to react to URL changes

  // Reset modal search when opening the modal
  useEffect(() => {
    if (showFullListModal) {
      setModalSearchQuery('');
    }
  }, [showFullListModal]);

  return (
    <>
      <div className="pb-3">
        <h2 className="text-lg flex justify-between items-center">
          <span>{title}</span>
          <div className="flex items-center space-x-2">
            {attendanceData === undefined ? (
              <Skeleton className="h-6 w-20" />
            ) : (
              <>
                <Badge variant="outline" className="bg-green-50">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> {attendingCount}
                </Badge>
                <Badge variant="outline" className="bg-red-50">
                  <XCircle className="h-3 w-3 mr-1" /> {notAttendingCount}
                </Badge>
                {pendingCount > 0 && <Badge variant="outline">{pendingCount} pending</Badge>}

                {/* Action Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setShowCopyDialog(true)}
                      className="cursor-pointer flex items-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy List as Text
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </h2>
      </div>
      <div>
        {attendanceData === undefined ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search names..."
                className="w-full px-3 py-2 border rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Tabs
              defaultValue="responded"
              value={activeTab}
              onValueChange={(value) => handleTabChange(value as 'pending' | 'responded')}
            >
              <TabsList className="w-full mb-4">
                <TabsTrigger value="responded" className="flex-1">
                  Responded ({respondedNames.length})
                </TabsTrigger>
                <TabsTrigger value="pending" className="flex-1">
                  Pending ({pendingNames.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="responded">
                {/* Status Filter Buttons */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button
                    variant={statusFilter === 'attending' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('attending')}
                    className="flex items-center gap-1"
                  >
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    Attending
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {respondedAttendingCount}
                    </Badge>
                  </Button>
                  <Button
                    variant={statusFilter === 'not_attending' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('not_attending')}
                    className="flex items-center gap-1"
                  >
                    <XCircle className="h-3 w-3 text-red-500" />
                    Not Attending
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {respondedNotAttendingCount}
                    </Badge>
                  </Button>
                  {statusFilter !== 'all' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStatusFilter('all')}
                      className="flex items-center gap-1 px-2"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>

                {filteredRespondedNames.length === 0 ? (
                  <AttendanceEmptyState
                    message="No results found"
                    onJoin={handleJoin}
                    showJoinButton={!searchQuery.trim()}
                  />
                ) : (
                  <div className="space-y-2">
                    {filteredRespondedNames.slice(0, 7).map((name) => {
                      const record = attendanceMap.get(name);
                      const status = record?.status;
                      const reason = record?.reason;
                      const remarks = record?.remarks;
                      const isYou = _isCurrentUser(
                        name,
                        attendanceMap,
                        isAuthenticated,
                        currentUser
                      );

                      return (
                        <div key={name} className="p-2 border rounded-md relative hover:bg-gray-50">
                          <button
                            className="cursor-pointer w-full text-left p-0 inline-block"
                            type="button"
                            onClick={() => handlePersonClick(name)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handlePersonClick(name);
                              }
                            }}
                          >
                            <div className="flex items-center">
                              {status === 'attending' ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                              ) : status === 'not_attending' ? (
                                <XCircle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                              ) : (
                                <div className="h-4 w-4 rounded-full border mr-2 flex-shrink-0" />
                              )}
                              <span className="ml-2 text-sm">
                                {name}
                                {isYou && (
                                  <span className="ml-1 text-xs text-muted-foreground">(you)</span>
                                )}
                              </span>
                            </div>

                            {/* Always show reason or remarks */}
                            {(status === 'not_attending' && reason) ||
                            (status === 'attending' && remarks) ? (
                              <div className="mt-1 text-sm text-muted-foreground">
                                {status === 'attending' && remarks && <p>Remarks: {remarks}</p>}
                                {status === 'not_attending' && reason && <p>Reason: {reason}</p>}
                              </div>
                            ) : null}
                          </button>
                        </div>
                      );
                    })}
                    {filteredRespondedNames.length > 7 && (
                      <Button
                        variant="ghost"
                        className="w-full mt-3 text-muted-foreground hover:text-foreground h-9 rounded-md transition-colors flex items-center justify-center"
                        onClick={() => setShowFullListModal(true)}
                      >
                        View {filteredRespondedNames.length - 7} more responses
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="pending">
                {pendingNames.length === 0 ? (
                  <AttendanceEmptyState
                    message="No results found"
                    onJoin={handleJoin}
                    showJoinButton={!searchQuery.trim()}
                  />
                ) : (
                  <div className="space-y-2">
                    {pendingNames.slice(0, 7).map((name) => {
                      const isYou = _isCurrentUser(
                        name,
                        attendanceMap,
                        isAuthenticated,
                        currentUser
                      );
                      return (
                        <div key={name} className="p-2 border rounded-md relative hover:bg-gray-50">
                          <button
                            className="cursor-pointer w-full text-left p-0 inline-block"
                            type="button"
                            onClick={() => handlePersonClick(name)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handlePersonClick(name);
                              }
                            }}
                          >
                            <div className="flex items-center">
                              <div className="h-4 w-4 rounded-full border mr-2 flex-shrink-0" />
                              <span className="ml-2 text-sm">
                                {name}
                                {isYou && (
                                  <span className="ml-1 text-xs text-muted-foreground">(you)</span>
                                )}
                              </span>
                            </div>
                          </button>
                        </div>
                      );
                    })}
                    {pendingNames.length > 7 && (
                      <Button
                        variant="ghost"
                        className="w-full mt-3 text-muted-foreground hover:text-foreground h-9 rounded-md transition-colors flex items-center justify-center"
                        onClick={() => setShowFullListModal(true)}
                      >
                        View {pendingNames.length} pending responses
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Join button below component */}
            {(!isAuthenticated || !isCurrentUserRegistered) && (
              <div className="mt-6 text-center">
                <p className="text-muted-foreground mb-2">Don't see your name?</p>
                <Button
                  onClick={handleJoin}
                  className="flex items-center justify-center mx-auto w-fit"
                  variant="outline"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Join the list
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Full list modal - update to show based on active tab */}
      <Dialog open={showFullListModal} onOpenChange={setShowFullListModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {activeTab === 'pending'
                ? 'Pending Responses'
                : statusFilter === 'all'
                  ? 'All Responses'
                  : statusFilter === 'attending'
                    ? 'Attending Responses'
                    : 'Not Attending Responses'}{' '}
              ({displayNames.length})
            </DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search names..."
              className="w-full px-3 py-2 border rounded-md"
              value={modalSearchQuery}
              onChange={(e) => setModalSearchQuery(e.target.value)}
            />
          </div>
          <div className="h-[350px]">
            <ScrollArea className="h-full">
              {modalFilteredNames.length > 0 ? (
                <div className="space-y-2">
                  {modalFilteredNames.map((name) => {
                    const record = attendanceMap.get(name);
                    const status = record?.status;
                    const reason = record?.reason;
                    const remarks = record?.remarks;
                    const isYou = _isCurrentUser(name, attendanceMap, isAuthenticated, currentUser);

                    return (
                      <div key={name} className="p-2 border rounded-md relative hover:bg-gray-50">
                        <button
                          className="cursor-pointer w-full text-left p-0 inline-block"
                          type="button"
                          onClick={() => {
                            setSelectedPerson(name);
                            const wasInExpectedList = expectedNames?.includes(name);
                            setIsManualJoin(!wasInExpectedList);
                            setDialogOpen(true);
                            setShowFullListModal(false);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              setSelectedPerson(name);
                              const wasInExpectedList = expectedNames?.includes(name);
                              setIsManualJoin(!wasInExpectedList);
                              setDialogOpen(true);
                              setShowFullListModal(false);
                            }
                          }}
                        >
                          <div className="flex items-center">
                            {status === 'attending' ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            ) : status === 'not_attending' ? (
                              <XCircle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                            ) : (
                              <div className="h-4 w-4 rounded-full border mr-2 flex-shrink-0" />
                            )}
                            <span className="ml-2 text-sm">
                              {name}
                              {isYou && (
                                <span className="ml-1 text-xs text-muted-foreground">(you)</span>
                              )}
                            </span>
                          </div>

                          {/* Always show reason or remarks */}
                          {(status === 'not_attending' && reason) ||
                          (status === 'attending' && remarks) ? (
                            <div className="mt-1 text-sm text-muted-foreground">
                              {status === 'attending' && remarks && <p>Remarks: {remarks}</p>}
                              {status === 'not_attending' && reason && <p>Reason: {reason}</p>}
                            </div>
                          ) : null}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <AttendanceEmptyState
                  message="No results found"
                  onJoin={() => {
                    setShowFullListModal(false);
                    handleJoin();
                  }}
                  showJoinButton={!modalSearchQuery.trim()}
                />
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      {/* Copy Configuration Dialog */}
      <Dialog open={showCopyDialog} onOpenChange={setShowCopyDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Copy Attendance List</DialogTitle>
            <DialogDescription>
              Configure how you want to copy the attendance data as text.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Copy Options */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Options</h4>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeRemarks"
                  checked={copyOptions.includeRemarks}
                  onCheckedChange={(checked) =>
                    setCopyOptions((prev) => ({ ...prev, includeRemarks: checked as boolean }))
                  }
                />
                <label htmlFor="includeRemarks" className="text-sm">
                  Include remarks and reasons
                </label>
              </div>

              {activeTab === 'responded' && statusFilter === 'all' && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="groupByStatus"
                    checked={copyOptions.groupByStatus}
                    onCheckedChange={(checked) =>
                      setCopyOptions((prev) => ({ ...prev, groupByStatus: checked as boolean }))
                    }
                  />
                  <label htmlFor="groupByStatus" className="text-sm">
                    Group by attendance status
                  </label>
                </div>
              )}
            </div>

            {/* Preview */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Preview</h4>
              <div className="bg-muted p-3 rounded-md text-xs font-mono whitespace-pre-wrap h-60 overflow-y-auto">
                {generatePreviewText()}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCopyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCopyAttendanceData} className="flex items-center gap-2">
              {copySuccess ? (
                <>
                  <Check className="h-4 w-4 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy to Clipboard
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {dialogOpen && attendanceRecords && (
        <AttendanceDialog
          isOpen={dialogOpen}
          onClose={handleDialogClose}
          personName={selectedPerson}
          attendanceKey={attendanceKey}
          attendanceRecords={attendanceRecords}
          onSuccess={handleAttendanceSuccess}
          isManuallyJoined={isManualJoin}
          remarksPlaceholder={remarksPlaceholder}
        />
      )}
    </>
  );
};

/**
 * Main Attendance component with Suspense boundary for handling async operations.
 */
export const Attendance = (props: AttendanceModuleProps) => {
  return (
    <Suspense
      fallback={
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      }
    >
      <AttendanceContent {...props} />
    </Suspense>
  );
};

/**
 * Get the current user's response from attendance data.
 * Internal helper function for extracting user response data.
 */
function _getCurrentUserResponse(
  attendanceData:
    | ReturnType<typeof useSessionQuery<typeof api.attendance.getAttendanceData>>
    | undefined
) {
  return attendanceData?.currentUserResponse;
}

/**
 * Check if a record belongs to the current user by comparing user IDs.
 * Internal helper function for user identification.
 */
function _isCurrentUser(
  name: string,
  attendanceMap: Map<string, Doc<'attendanceRecords'>>,
  isAuthenticated: boolean,
  currentUser: ReturnType<typeof useCurrentUser>
): boolean {
  const record = attendanceMap.get(name);
  return Boolean(isAuthenticated && currentUser && record?.userId === currentUser._id);
}
