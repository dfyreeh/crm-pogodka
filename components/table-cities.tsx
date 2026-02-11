"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spinner } from "./ui/spinner";
import { Input } from "@/components/ui/input";
import AddCityDialog from "./AddCityDialog";
import CityActions from "./CityActions";
import { toast } from "react-hot-toast";

import { Field, FieldLabel } from "@/components/ui/field";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type City = {
  id: number;
  nameUa: string;
  nameRu: string;
  nameEn: string;
  region: string;
  countryUa: string;
  countryEn: string;
  latitude: number;
  longitude: number;
  slug: string;
};

export default function TableCities() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  useEffect(() => {
    async function fetchCities() {
      const res = await fetch("/api/cities");
      const data: City[] = await res.json();
      setCities(data);
      setLoading(false);
    }
    fetchCities();
  }, []);

  const filteredCities = cities.filter(
    (city) =>
      city.nameUa.toLowerCase().includes(search.toLowerCase()) ||
      city.countryUa.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredCities.length / pageSize);

  const paginatedCities = filteredCities.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  if (loading)
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Spinner className="h-6 w-6" />
      </div>
    );

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/cities/${id}`, { method: "DELETE" });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Помилка при видаленні міста");
    }

    setCities((prev) => prev.filter((city) => city.id !== id));
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Міста {cities.length}</h1>

      <div className="flex justify-between mb-2 gap-2.5">
        <Input
          placeholder="Пошук..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="mb-4 max-w-sm"
        />

        <AddCityDialog onCityAdded={(city) => setCities([...cities, city])} />
      </div>

      <Table>
 <TableHeader>
  <TableRow>
    <TableHead className="bg-input dark:bg-input rounded-tl-2xl">#</TableHead>
    <TableHead className="bg-input dark:bg-input">Назва (UA)</TableHead>
    <TableHead className="bg-input dark:bg-input">Регіон</TableHead>
    <TableHead className="bg-input dark:bg-input">Країна (UA)</TableHead>
    <TableHead className="bg-input dark:bg-input">Широта</TableHead>
    <TableHead className="bg-input dark:bg-input">Довгота</TableHead>
    <TableHead className="bg-input dark:bg-input rounded-tr-2xl">Дії</TableHead>
  </TableRow>
</TableHeader>

        <TableBody>
          {paginatedCities.map((city, index) => (
            <TableRow key={city.id}>
              <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
              <TableCell>{city.nameUa}</TableCell>
              <TableCell>{city.region}</TableCell>
              <TableCell>{city.countryUa}</TableCell>
              <TableCell>{city.latitude}</TableCell>
              <TableCell>{city.longitude}</TableCell>
              <TableCell>
                <CityActions
                  cityId={city.id}
                  onDelete={handleDelete}
                  onEdit={(id) => toast.success(`Редагувати місто ${id}`)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* PAGINATION */}
      <div className="flex items-center justify-between gap-4 mt-4">
        <Field orientation="horizontal" className="w-fit">
          <FieldLabel>Рядків на сторінці</FieldLabel>

          <Select
            value={String(pageSize)}
            onValueChange={(v) => {
              setPageSize(Number(v));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>

            <SelectContent align="start">
              <SelectGroup className="cursor-pointer">
                <SelectItem className="cursor-pointer" value="6">6</SelectItem>
                <SelectItem className="cursor-pointer" value="10">10</SelectItem>
                <SelectItem className="cursor-pointer" value="25">25</SelectItem>
                <SelectItem className="cursor-pointer" value="50">50</SelectItem>
                <SelectItem className="cursor-pointer" value="100">100</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>

        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              />
            </PaginationItem>

            <span className="px-3 text-sm">
              {page} / {totalPages || 1}
            </span>

            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(totalPages || 1, p + 1))}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
