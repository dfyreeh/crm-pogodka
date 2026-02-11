"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { Spinner } from "./ui/spinner";

type CityForm = {
  nameUa: string;
  nameRu: string;
  nameEn: string;
  region: string;
  countryUa: string;
  countryEn: string;
  latitude: string;
  longitude: string;
  slug: string;
};

type AddCityDialogProps = {
  onCityAdded: (newCity: any) => void; // функция для обновления списка в родителе
};

export default function AddCityDialog({ onCityAdded }: AddCityDialogProps) {
  const [form, setForm] = React.useState<CityForm>({
    nameUa: "",
    nameRu: "",
    nameEn: "",
    region: "",
    countryUa: "",
    countryEn: "",
    latitude: "",
    longitude: "",
    slug: "",
  });

  const [isOpen, setIsOpen] = React.useState(false);
  const [isValid, setIsValid] = React.useState(false);

  React.useEffect(() => {
    const filled = Object.values(form).every((val) => val.trim() !== "");
    setIsValid(filled);
  }, [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const newCity = {
      ...form,
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
    };

    const promise = fetch("/api/cities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCity),
    }).then(async (res) => {
      if (!res.ok) throw new Error("Помилка при додаванні міста");
      return res.json();
    });

    toast.promise(promise, {
      loading: "Завантаження...",
      success: <b>Місто додано!</b>,
      error: <b>Не вдалося додати місто.</b>,
    });

    try {
      const savedCity = await promise;
      onCityAdded(savedCity);

      // Закрываем модалку и сбрасываем форму после успешного добавления
      setIsOpen(false);
      setForm({
        nameUa: "",
        nameRu: "",
        nameEn: "",
        region: "",
        countryUa: "",
        countryEn: "",
        latitude: "",
        longitude: "",
        slug: "",
      });
    } catch (error) {
      console.error(error);
      // Модалка остаётся открытой, если ошибка
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer flex gap-1">
          <Plus />
          Додати 
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Додати нове місто</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2 mt-2">
          <Input
            type="text"
            placeholder="nameUa"
            name="nameUa"
            value={form.nameUa}
            onChange={handleChange}
          />
          <Input
            type="text"
            placeholder="nameRu"
            name="nameRu"
            value={form.nameRu}
            onChange={handleChange}
          />
          <Input
            type="text"
            placeholder="nameEn"
            name="nameEn"
            value={form.nameEn}
            onChange={handleChange}
          />
          <Input
            type="text"
            placeholder="region"
            name="region"
            value={form.region}
            onChange={handleChange}
          />
          <Input
            type="text"
            placeholder="countryUa"
            name="countryUa"
            value={form.countryUa}
            onChange={handleChange}
          />
          <Input
            type="text"
            placeholder="countryEn"
            name="countryEn"
            value={form.countryEn}
            onChange={handleChange}
          />
          <Input
            type="text"
            placeholder="latitude"
            name="latitude"
            value={form.latitude}
            onChange={handleChange}
          />
          <Input
            type="text"
            placeholder="longitude"
            name="longitude"
            value={form.longitude}
            onChange={handleChange}
          />
          <Input
            type="text"
            placeholder="Slug"
            name="slug"
            value={form.slug}
            onChange={handleChange}
          />
          <Button className="mt-2" onClick={handleSubmit} disabled={!isValid}>
            Зберегти
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
