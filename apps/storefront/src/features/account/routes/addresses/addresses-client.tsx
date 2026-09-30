'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, MoreVertical, Home, CreditCard, Edit2, Trash2, MapPin, Phone, Building2 } from 'lucide-react';
import { AddressForm } from './address-form';
import { createAddress, updateAddress, deleteAddress, setDefaultShippingAddress, setDefaultBillingAddress } from './actions';
import { useRouter } from '@/platform/i18n/navigation';
import { useTranslations } from 'next-intl';

interface Country {
    id: string;
    code: string;
    name: string;
}

interface CustomerAddress {
    id: string;
    fullName?: string | null;
    company?: string | null;
    streetLine1: string;
    streetLine2?: string | null;
    city?: string | null;
    province?: string | null;
    postalCode?: string | null;
    country: { id: string; code: string; name: string };
    phoneNumber?: string | null;
    defaultShippingAddress?: boolean | null;
    defaultBillingAddress?: boolean | null;
}

interface AddressesClientProps {
    addresses: CustomerAddress[];
    countries: Country[];
}

export function AddressesClient({ addresses, countries }: AddressesClientProps) {
    const t = useTranslations('Account');
    const router = useRouter();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [settingDefault, setSettingDefault] = useState<{ id: string; type: 'shipping' | 'billing' } | null>(null);

    const handleAddNew = () => {
        setEditingAddress(null);
        setDialogOpen(true);
    };

    const handleEdit = (address: CustomerAddress) => {
        setEditingAddress(address);
        setDialogOpen(true);
    };

    const handleDelete = (addressId: string) => {
        setAddressToDelete(addressId);
        setDeleteDialogOpen(true);
    };

    const handleSetDefaultShipping = async (addressId: string) => {
        setSettingDefault({ id: addressId, type: 'shipping' });
        try {
            await setDefaultShippingAddress(addressId);
            router.refresh();
        } catch (error) {
            console.error('Error setting default shipping address:', error);
            alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setSettingDefault(null);
        }
    };

    const handleSetDefaultBilling = async (addressId: string) => {
        setSettingDefault({ id: addressId, type: 'billing' });
        try {
            await setDefaultBillingAddress(addressId);
            router.refresh();
        } catch (error) {
            console.error('Error setting default billing address:', error);
            alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setSettingDefault(null);
        }
    };

    const confirmDelete = async () => {
        if (!addressToDelete) return;

        setIsDeleting(true);
        try {
            await deleteAddress(addressToDelete);
            router.refresh();
            setDeleteDialogOpen(false);
            setAddressToDelete(null);
        } catch (error) {
            console.error('Error deleting address:', error);
            alert(`Error deleting address: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsDeleting(false);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            if (editingAddress) {
                await updateAddress(data);
            } else {
                await createAddress(data);
            }
            router.refresh();
            setDialogOpen(false);
            setEditingAddress(null);
        } catch (error) {
            console.error('Error saving address:', error);
            alert(`Error saving address: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="font-sans text-2xl sm:text-3xl font-bold text-[#1D120A] dark:text-[#F8F4EE] tracking-tight">
                        {t('addresses')}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#6B5E55] dark:text-[#B5A496] mt-0.5">
                        {t('addressesCount', { count: addresses.length })}
                    </p>
                </div>

                <Button
                    onClick={handleAddNew}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F291E] hover:bg-[#1A3D2E] text-white text-xs sm:text-sm font-medium shadow-xs"
                >
                    <Plus className="h-4 w-4" />
                    <span>{t('addNewAddress')}</span>
                </Button>
            </div>

            {/* Address Grid */}
            {addresses.length === 0 ? (
                <div className="bg-white dark:bg-[#160E08] border border-[#EAE6DF] dark:border-[#3A291C] rounded-xl p-12 text-center shadow-xs space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF8F5] dark:bg-[#22160F] border border-[#EAE6DF] dark:border-[#3A291C] flex items-center justify-center text-[#A66B2D]">
                        <MapPin className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-sans text-xl font-bold text-[#1D120A] dark:text-[#F8F4EE]">
                            {t('noAddressesSaved')}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#6B5E55] dark:text-[#B5A496] max-w-sm mx-auto">
                            Ajoutez votre première adresse pour faciliter vos prochaines livraisons.
                        </p>
                    </div>
                    <div className="pt-2">
                        <Button
                            onClick={handleAddNew}
                            className="bg-[#0F291E] hover:bg-[#1A3D2E] text-white rounded-xl px-5 py-2.5 text-xs sm:text-sm shadow-xs"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            {t('addFirstAddress')}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {addresses.map((address) => (
                        <div
                            key={address.id}
                            className="bg-white dark:bg-[#160E08] border border-[#EAE6DF] dark:border-[#3A291C] rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between hover:border-[#D4A43C]/40 transition-colors"
                        >
                            <div className="space-y-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="space-y-1">
                                        <h3 className="font-sans font-bold text-base sm:text-lg text-[#1D120A] dark:text-[#F8F4EE]">
                                            {address.fullName}
                                        </h3>
                                        {(address.defaultShippingAddress || address.defaultBillingAddress) && (
                                            <div className="flex flex-wrap gap-2 pt-0.5">
                                                {address.defaultShippingAddress && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EAA838]/10 text-[#A66B2D] border border-[#EAA838]/30">
                                                        {t('defaultShipping')}
                                                    </span>
                                                )}
                                                {address.defaultBillingAddress && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#0F291E]/10 text-[#0F291E] dark:text-[#A6D4B8] border border-[#0F291E]/20">
                                                        {t('defaultBilling')}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Dropdown */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            render={
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label="Address actions"
                                                    className="h-8 w-8 rounded-lg text-[#8C7A6B] hover:text-[#1D120A]"
                                                />
                                            }
                                        >
                                            <MoreVertical className="h-4 w-4" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-xl border-[#EAE6DF] dark:border-[#3A291C]">
                                            <DropdownMenuItem onClick={() => handleEdit(address)} className="cursor-pointer">
                                                <Edit2 className="mr-2 h-4 w-4 text-[#8C7A6B]" />
                                                <span>{t('edit')}</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => handleSetDefaultShipping(address.id)}
                                                disabled={
                                                    Boolean(address.defaultShippingAddress) ||
                                                    (settingDefault?.id === address.id && settingDefault?.type === 'shipping')
                                                }
                                                className="cursor-pointer"
                                            >
                                                <Home className="mr-2 h-4 w-4 text-[#8C7A6B]" />
                                                <span>{address.defaultShippingAddress ? t('defaultShipping') : t('setAsShipping')}</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleSetDefaultBilling(address.id)}
                                                disabled={
                                                    Boolean(address.defaultBillingAddress) ||
                                                    (settingDefault?.id === address.id && settingDefault?.type === 'billing')
                                                }
                                                className="cursor-pointer"
                                            >
                                                <CreditCard className="mr-2 h-4 w-4 text-[#8C7A6B]" />
                                                <span>{address.defaultBillingAddress ? t('defaultBilling') : t('setAsBilling')}</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => handleDelete(address.id)}
                                                className="text-destructive focus:text-destructive cursor-pointer"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                                                <span>{t('delete')}</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Address Details */}
                                <div className="space-y-1.5 text-xs sm:text-sm text-[#4A3728] dark:text-[#D5C7B8] pt-1 border-t border-[#F0EBE1] dark:border-[#2A1D15]">
                                    {address.company && (
                                        <div className="flex items-center gap-2 text-[#8C7A6B]">
                                            <Building2 className="w-3.5 h-3.5 shrink-0" />
                                            <span>{address.company}</span>
                                        </div>
                                    )}
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-3.5 h-3.5 mt-0.5 text-[#8C7A6B] shrink-0" />
                                        <span>
                                            {address.streetLine1}
                                            {address.streetLine2 && `, ${address.streetLine2}`}
                                            <br />
                                            {address.city}, {address.province} {address.postalCode}
                                            <br />
                                            <strong className="text-[#1D120A] dark:text-[#F8F4EE]">{address.country.name}</strong>
                                        </span>
                                    </div>
                                    {address.phoneNumber && (
                                        <div className="flex items-center gap-2 pt-1 text-[#8C7A6B]">
                                            <Phone className="w-3.5 h-3.5 shrink-0" />
                                            <span className="font-mono text-xs">{address.phoneNumber}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Card Footer Actions */}
                            <div className="pt-4 mt-3 border-t border-[#F0EBE1] dark:border-[#2A1D15] flex items-center justify-end gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEdit(address)}
                                    className="rounded-lg h-8 px-3 text-xs border-[#EAE6DF] dark:border-[#3A291C] hover:bg-[#FAF8F5]"
                                >
                                    <Edit2 className="w-3.5 h-3.5 mr-1 text-[#8C7A6B]" />
                                    {t('edit')}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add / Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto rounded-xl p-6 sm:p-8 bg-white dark:bg-[#160E08] border border-[#EAE6DF] dark:border-[#3A291C]">
                    <DialogHeader>
                        <DialogTitle className="font-sans text-2xl font-bold text-[#1D120A] dark:text-[#F8F4EE]">
                            {editingAddress ? t('editAddress') : t('addNewAddressDialog')}
                        </DialogTitle>
                        <DialogDescription className="text-xs sm:text-sm text-[#6B5E55] dark:text-[#B5A496]">
                            {editingAddress ? t('updateAddressDetails') : t('fillAddressForm')}
                        </DialogDescription>
                    </DialogHeader>
                    <AddressForm
                        countries={countries}
                        address={editingAddress || undefined}
                        onSubmit={handleSubmit}
                        onCancel={() => {
                            setDialogOpen(false);
                            setEditingAddress(null);
                        }}
                        isSubmitting={isSubmitting}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Alert */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="rounded-xl bg-white dark:bg-[#160E08] border border-[#EAE6DF] dark:border-[#3A291C]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="font-sans text-xl font-bold text-[#1D120A] dark:text-[#F8F4EE]">
                            {t('deleteConfirmTitle')}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-xs sm:text-sm text-[#6B5E55] dark:text-[#B5A496]">
                            {t('deleteConfirmDescription')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2">
                        <AlertDialogCancel disabled={isDeleting} className="rounded-xl border-[#EAE6DF] dark:border-[#3A291C]">
                            {t('cancel')}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            disabled={isDeleting}
                            className="rounded-xl bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isDeleting ? t('deleting') : t('delete')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
