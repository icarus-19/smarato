import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useWallet } from '../context/WalletContext';

export default function SendScreen() {
  const { wallet, setWallet } = useWallet();
  const [tab, setTab] = useState<'manual' | 'scan'>('manual');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [sendMsg, setSendMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanMsg, setScanMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [pasteVal, setPasteVal] = useState('');

  const fmt = (n: number) => n.toLocaleString('en-KE');
  const now = () => {
    const d = new Date();
    return `${d.toLocaleDateString('en-KE', { weekday: 'short' })}, ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
  };
  const flash = (setter: any, text: string, ok: boolean) => {
    setter({ text, ok });
    setTimeout(() => setter(null), 3500);
  };

  const processQR = (data: string) => {
    data = data.trim();
    let amt: number, noteTxt = 'QR Payment';
    if (data.startsWith('SMPAY:')) {
      const p = data.split(':');
      amt = parseFloat(p[1]);
      if (p[2]) noteTxt = p[2];
    } else if (!isNaN(Number(data))) {
      amt = parseFloat(data);
    } else {
      flash(setScanMsg, 'Unrecognised QR format.', false); return;
    }
    if (!amt || amt <= 0) { flash(setScanMsg, 'Invalid amount in QR.', false); return; }
    if (amt > wallet.balance) { flash(setScanMsg, 'Insufficient balance!', false); return; }
    setWallet(prev => ({
      ...prev,
      balance: prev.balance - amt,
      transactions: [
        { id: Date.now().toString(), dir: 'sent', name: 'QR: ' + noteTxt, amount: amt, note: noteTxt, time: now() },
        ...prev.transactions,
      ],
    }));
    flash(setScanMsg, `Paid KES ${fmt(amt)} via QR!`, true);
    setScanned(true);
    setPasteVal('');
  };

  const handleSend = () => {
    if (!recipient) { flash(setSendMsg, 'Enter a recipient.', false); return; }
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { flash(setSendMsg, 'Enter a valid amount.', false); return; }
    if (amt > wallet.balance) { flash(setSendMsg, 'Insufficient balance!', false); return; }
    setWallet(prev => ({
      ...prev,
      balance: prev.balance - amt,
      transactions: [
        { id: Date.now().toString(), dir: 'sent', name: 'To +254 ' + recipient, amount: amt, note: note || '', time: now() },
        ...prev.transactions,
      ],
    }));
    flash(setSendMsg, `Sent KES ${fmt(amt)} successfully!`, true);
    setRecipient(''); setAmount(''); setNote('');
  };

  return (
    <ScrollView style={s.root} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <Text style={s.pageTitle}>Send Money</Text>
      <View style={s.tabs}>
        <TouchableOpacity style={[s.tab, tab==='manual' && s.tabActive]} onPress={() => setTab('manual')}>
          <Text style={[s.tabTxt, tab==='manual' && s.tabTxtActive]}>Manual</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.tab, tab==='scan' && s.tabActive]} onPress={() => setTab('scan')}>
          <Text style={[s.tabTxt, tab==='scan' && s.tabTxtActive]}>Scan QR</Text>
        </TouchableOpacity>
      </View>
      {tab === 'manual' && (
        <View style={s.card}>
          <Text style={s.label}>Recipient</Text>
          <View style={s.prefixWrap}>
            <Text style={s.prefix}>+254</Text>
            <TextInput style={[s.input, { paddingLeft: 52 }]} placeholder="7XX XXX XXX"
              keyboardType="phone-pad" value={recipient} onChangeText={setRecipient} placeholderTextColor="#888780" />
          </View>
          <Text style={s.label}>Amount (KES)</Text>
          <TextInput style={s.input} placeholder="e.g. 200" keyboardType="numeric"
            value={amount} onChangeText={setAmount} placeholderTextColor="#888780" />
          <Text style={s.label}>Note (optional)</Text>
          <TextInput style={s.input} placeholder="e.g. Rent"
            value={note} onChangeText={setNote} placeholderTextColor="#888780" />
          {sendMsg && <View style={[s.alert, sendMsg.ok ? s.alertOk : s.alertErr]}><Text style={sendMsg.ok ? s.alertOkTxt : s.alertErrTxt}>{sendMsg.text}</Text></View>}
          <TouchableOpacity style={s.btnGreen} onPress={handleSend}>
            <Text style={s.btnGreenTxt}>Send Money</Text>
          </TouchableOpacity>
        </View>
      )}
      {tab === 'scan' && (
        <View style={s.card}>
          {!permission ? (
            <ActivityIndicator color="#1D9E75" />
          ) : !permission.granted ? (
            <View style={s.permBox}>
              <Text style={s.permTxt}>Camera permission needed to scan QR codes.</Text>
              <TouchableOpacity style={s.btnGreen} onPress={requestPermission}>
                <Text style={s.btnGreenTxt}>Grant Permission</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={s.camWrap}>
              <CameraView
                style={s.cam}
                facing="back"
                barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                onBarcodeScanned={scanned ? undefined : ({ data }) => { setScanned(true); processQR(data); }}
              >
                <View style={s.camOverlay}>
                  <View style={s.camFrame} />
                </View>
              </CameraView>
              {scanned && (
                <TouchableOpacity style={[s.btnGreen, { marginTop: 10 }]} onPress={() => setScanned(false)}>
                  <Text style={s.btnGreenTxt}>Scan Again</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          {scanMsg && <View style={[s.alert, scanMsg.ok ? s.alertOk : s.alertErr]}><Text style={scanMsg.ok ? s.alertOkTxt : s.alertErrTxt}>{scanMsg.text}</Text></View>}
          <View style={s.divider}><View style={s.divLine}/><Text style={s.divTxt}>or paste QR data</Text><View style={s.divLine}/></View>
          <Text style={s.label}>QR code data</Text>
          <TextInput style={s.input} placeholder="SMPAY:500:Note"
            value={pasteVal} onChangeText={setPasteVal} placeholderTextColor="#888780" />
          <TouchableOpacity style={s.btnOutline} onPress={() => processQR(pasteVal)}>
            <Text style={s.btnOutlineTxt}>Process QR</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f5f5f3' },
  content: { padding: 16, paddingTop: 60 },
  pageTitle: { fontSize: 11, fontWeight: '600', color: '#888780', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 12 },
  tabs: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.1)', padding: 3, marginBottom: 12 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  tabActive: { backgroundColor: '#1D9E75' },
  tabTxt: { fontSize: 14, fontWeight: '500', color: '#888780' },
  tabTxtActive: { color: '#fff' },
  card: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.1)', padding: 18, marginBottom: 12 },
  label: { fontSize: 12, fontWeight: '500', color: '#5f5e5a', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: 'rgba(0,0,0,0.18)', borderRadius: 8, padding: 11, fontSize: 15, color: '#1a1a18', backgroundColor: '#f5f5f3', marginBottom: 12 },
  prefixWrap: { position: 'relative', marginBottom: 12 },
  prefix: { position: 'absolute', left: 13, top: 12, color: '#5f5e5a', fontSize: 14, fontWeight: '500', zIndex: 1 },
  btnGreen: { backgroundColor: '#1D9E75', borderRadius: 10, padding: 14, alignItems: 'center' },
  btnGreenTxt: { color: '#fff', fontSize: 15, fontWeight: '600' },
  btnOutline: { borderWidth: 1, borderColor: 'rgba(0,0,0,0.18)', borderRadius: 10, padding: 12, alignItems: 'center', marginTop: 8 },
  btnOutlineTxt: { fontSize: 14, fontWeight: '500', color: '#1a1a18' },
  alert: { borderRadius: 8, padding: 10, marginBottom: 10 },
  alertOk: { backgroundColor: '#E1F5EE' },
  alertErr: { backgroundColor: '#FAECE7' },
  alertOkTxt: { color: '#085041', fontSize: 13, fontWeight: '500' },
  alertErrTxt: { color: '#D85A30', fontSize: 13, fontWeight: '500' },
  permBox: { alignItems: 'center', gap: 12, paddingVertical: 10 },
  permTxt: { fontSize: 13, color: '#5f5e5a', textAlign: 'center' },
  camWrap: { borderRadius: 12, overflow: 'hidden' },
  cam: { width: '100%', aspectRatio: 1 },
  camOverlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  camFrame: { width: '60%', aspectRatio: 1, borderRadius: 12, borderWidth: 2, borderColor: 'rgba(255,255,255,0.8)', backgroundColor: 'transparent' },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 14 },
  divLine: { flex: 1, height: 1, backgroundColor: 'rgba(0,0,0,0.1)' },
  divTxt: { fontSize: 12, color: '#888780' },
});
