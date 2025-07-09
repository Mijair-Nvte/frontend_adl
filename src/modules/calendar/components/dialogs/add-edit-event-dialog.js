import { useForm } from "react-hook-form";
import { format, addMinutes, set } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useEffect } from "react";
import { useDisclosure } from "@/modules/calendar/hooks";
import { useCalendar } from "@/modules/calendar/contexts/calendar-context";
import { eventSchema } from "@/modules/calendar/schemas";
import { COLORS } from "@/modules/calendar/constants";
import MultiSelect from "@/components/ui/MultiSelect";

import { createEvent, updateEvent as apiUpdateEvent } from "@/services/event/eventService";
import { createTask, updateTask } from "@/services/tasks/taskService";


import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/calendarui/ui/form";
import { Input } from "@/components/calendarui/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/calendarui/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/calendarui/ui/dialog";
import { Button } from "@/components/calendarui/ui/button";
import { Textarea } from "@/components/calendarui/ui/textarea";
import { DateTimePicker } from "@/components/calendarui/ui/date-time-picker";


export function AddEditEventDialog({ children, startDate, startTime, event }) {
  const { isOpen, onClose, onToggle } = useDisclosure();


  const { users, cases, calendarGroups, loadingUsers, loadingCases, loadingGroups } = useCalendar();
  const { addEvent, updateEvent, fetchEvents } = useCalendar();
  const isEditing = !!event;

  const isLoadingData = loadingUsers || loadingCases || loadingGroups;





  const userOptions = users.map((user) => ({
    value: user.id,
    label: user.name || `Usuario #${user.id}`,
  }));


  const getInitialDates = () => {
    if (!startDate) {
      return {
        startDate: new Date(),
        endDate: addMinutes(new Date(), 30)
      };
    }
    const start = startTime
      ? set(new Date(startDate), {
        hours: startTime.hour,
        minutes: startTime.minute,
        seconds: 0
      })
      : new Date(startDate);
    const end = addMinutes(start, 30);
    return { startDate: start, endDate: end };
  };

  const initialDates = getInitialDates();

  const parseEventDates = () => {
    if (!event) return null;
    return {
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate)
    };
  };

  const eventDates = parseEventDates();

  const form = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: isEditing
      ? {
        title: event.title,
        description: event.description,
        startDate: eventDates?.startDate,
        endDate: eventDates?.endDate,
        calendar_group_id: event.calendar_group?.id || "",
        case_id: event.case?.id || "",
        sync_to_google: event.sync_to_google || false,
        user_ids: event.users?.map((u) => u.id) || [],
      }
      : {
        title: "",
        description: "",
        startDate: initialDates.startDate,
        endDate: initialDates.endDate,
        calendar_group_id: "",
        case_id: "",
        sync_to_google: false,
        user_ids: [],
      }

  });

  useEffect(() => {
    if (
      isEditing &&
      event &&
      users.length > 0 &&
      cases.length > 0 &&
     calendarGroups.length > 0
    ) {
      console.log("Grupo actual:", event.calendar_group?.id)
      form.reset({
        title: event.title || "",
        description: event.description || "",
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
        calendar_group_id: event.calendar_group?.id?.toString() || "",
        case_id: event.case?.id || "",
        sync_to_google: event.sync_to_google || false,
        user_ids: event.users?.map((u) => u.id) || [],
      });
    }
  },  [isEditing, event, users, cases, calendarGroups, form]);

  const onSubmit = async (values) => {
    try {
      const payload = {
        title: values.title,
        description: values.description,
        calendar_group_id: values.calendar_group_id ? parseInt(values.calendar_group_id) : null,
        case_id: values.case_id ? parseInt(values.case_id) : null,
        sync_to_google: values.sync_to_google || false,
        user_ids: values.user_ids || [],
        start_datetime: format(values.startDate, "yyyy-MM-dd HH:mm:ss"),
        end_datetime: format(values.endDate, "yyyy-MM-dd HH:mm:ss"),
      };

      // Detectar tipo y ID real a partir del prefijo
      const [type, realId] = (event?.id || "").includes("-")
        ? event.id.split("-")
        : ["event", event?.id];

      let response;

      if (isEditing) {
        if (type === "task") {
          response = await updateTask(realId, payload);
        } else {
          response = await apiUpdateEvent(realId, payload);
        }

        updateEvent({
          ...response,
          id: `${type}-${response.id}`,
          startDate: response.start_datetime ? new Date(response.start_datetime) : null,
          endDate: response.end_datetime ? new Date(response.end_datetime) : null,
        });


        toast.success(`${type === "task" ? "Tarea" : "Evento"} actualizado correctamente`);
      } else {
        if (type === "task") {
          response = await createTask(payload);
        } else {
          response = await createEvent(payload);
        }

        addEvent({
          ...response,
          id: `${type}-${response.id}`,
          startDate: new Date(response.start_datetime),
          endDate: new Date(response.end_datetime),
        });

        toast.success(`${type === "task" ? "Tarea" : "Evento"} creado correctamente`);
      }
      await fetchEvents();
      onClose();
      form.reset();
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error("Ocurrió un error al guardar el elemento");
    }
  };

  const [type] = (event?.id || "").includes("-") //sirve para ocultar tareas y evetns
    ? event.id.split("-")
    : ["event"];


  return (
    <Dialog open={isOpen} onOpenChange={onToggle} modal={false}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar evento" : "Nuevo evento"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modificar registro existente."
              : "Crear nuevo evento para tu calendario."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="event-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor="title" className="required">
                    Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="title"
                      placeholder="Enter a title"
                      {...field}
                      className={fieldState.invalid ? "border-red-500" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => <DateTimePicker form={form} field={field} />}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => <DateTimePicker form={form} field={field} />}
            />
            <FormField
              control={form.control}
              name="calendar_group_id"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="required">Grupo del calendario</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value?.toString() || ""}
                      onValueChange={(val) => field.onChange(val)}
                      ref={field.ref}
                    >

                      <SelectTrigger className={`w-full ${fieldState.invalid ? "border-red-500" : ""}`}>
                        <SelectValue placeholder="Selecciona un grupo" />
                      </SelectTrigger>
                      <SelectContent>
                        {calendarGroups.map((group) => (
                          <SelectItem key={group.id} value={String(group.id)}>
                            <div className="flex items-center gap-2">
                              <div className="size-3.5 rounded-full" style={{ backgroundColor: group.color }} />
                              {group.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="required">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter a description"
                      className={fieldState.invalid ? "border-red-500" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            {type !== "task" && (
              <>
                {/* Expediente */}
                < FormField
                  control={form.control}
                  name="case_id"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Proyecto vinculado</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value?.toString() || ""}
                          onValueChange={(val) => field.onChange(val)}
                          ref={field.ref}
                        >

                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona un proyecto" />
                          </SelectTrigger>
                          <SelectContent>
                            {cases.map((c) => (
                              <SelectItem key={c.id} value={String(c.id)}>
                                {c.title || `Caso #${c.id}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {type !== "task" && (
              <>
                {/* Invitados */}
                < FormField
                  control={form.control}
                  name="user_ids"
                  render={({ field, }) => (
                    <FormItem>
                      <FormLabel>Invitados</FormLabel>
                      <FormControl>
                        <MultiSelect
                          name="user_ids"
                          value={
                            userOptions.length > 0
                              ? userOptions.filter((option) =>
                                field.value.includes(option.value)
                              )
                              : []
                          }
                          onChange={(selected) => {
                            const ids = selected.map((option) => option.value);
                            field.onChange(ids);
                          }}
                          options={userOptions}
                          isLoading={loadingUsers}
                          placeholder="Selecciona participantes"
                          ref={field.ref}
                        />

                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Sincronizar */}
            <FormField
              control={form.control}
              name="sync_to_google"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 mt-6">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="mr-2"
                    />
                  </FormControl>
                  <FormLabel className="mb-0">Sincronizar con Google</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />




          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button form="event-form" type="submit">
            {isEditing ? "Guardar Cambios" : "Crear Evento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
