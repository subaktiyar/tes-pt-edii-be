const mongoose = require("mongoose");

const PendidikanSchema = new mongoose.Schema({
  jenjang_pendidikan: { type: String, required: true },
  institusi: { type: String, required: true },
  jurusan: { type: String, default: "" },
  tahun_lulus: { type: String, required: true },
  ipk: { type: String, default: "" },
});

const PelatihanSchema = new mongoose.Schema({
  nama_pelatihan: { type: String, required: true },
  sertifikat: { type: String, required: true },
  tahun: { type: String, default: "" },
});

const PekerjaanSchema = new mongoose.Schema({
  nama_perusahaan: { type: String, required: true },
  posisi_terakhir: { type: String, required: true },
  pendapatan_terakhir: { type: Number, default: 0 },
  tahun: { type: String, required: true },
});

const KontakDaruratSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true },
    alamat: { type: String, required: true },
    no_telepon: { type: String, required: true },
  },
  { _id: false }
);

const Schema = new mongoose.Schema({
  nama: { type: String, default: "" },
  no_ktp: { type: String, default: "" },
  tempat_lahir: { type: String, default: "" },
  tanggal_lahir: { type: String, default: "" },
  jenis_kelamin: { type: String, default: "" },
  agama: { type: String, default: "" },
  golongan_darah: { type: String, default: "" },
  status: { type: String, default: "" },
  alamat_ktp: { type: String, default: "" },
  alamat_tinggal: { type: String, default: "" },
  no_telepon: { type: String, default: "" },
  kontak_darurat: { type: KontakDaruratSchema, default: null },
  posisi: { type: String, default: "" },

  email: { type: String, required: true, unique: true },

  pendidikan: { type: [PendidikanSchema], default: [] },
  pelatihan: { type: [PelatihanSchema], default: [] },
  riwayat_pekerjaan: { type: [PekerjaanSchema], default: [] },

  is_active: { type: Boolean, default: true },
  created_at: { type: Date, required: true },
  created_by: { type: String, required: true },
  updated_at: { type: Date, required: true },
  updated_by: { type: String, required: true },
  deleted_at: { type: Date },
  deleted_by: { type: String },
});

module.exports = Schema;
