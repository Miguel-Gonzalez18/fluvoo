import { CircleCheckBig, SlidersHorizontal, Telescope } from "lucide-react";

export function Benefits() {
    return (
        <section className="w-full max-w-6xl mx-auto relative py-12 flex flex-col md:flex-row gap-16">
            {/* Textos en sticky */}
            <div className="flex flex-col gap-2 sticky top-0 w-full md:w-2/5 space-y-2">
                <p className="text-md text-primary">Beneficios reales</p>
                <h2 className="text-3xl font-heading text-neutral-800 font-bold">Por qué los dominicanos eligen Fluvoo</h2>
                <p className="text-md text-neutral-600">Un motor de IA y herramientas financieras pensadas para quienes quieren moverse con claridad.</p>
                {/* items indexes */}
                <div className="flex flex-col gap-2">
                    <div className="bg-white border border-neutral-200 text-neutral-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                        <Telescope className="h-4 w-4 text-primary" aria-hidden="true" />
                        <span>Visibilidad total</span>
                    </div>
                    <div className="bg-white border border-neutral-200 text-neutral-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4 text-primary" aria-hidden="true" />
                        <span>Sin complicaciones</span>
                    </div>
                    <div className="bg-white border border-neutral-200 text-neutral-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                        <CircleCheckBig className="h-4 w-4 text-primary" aria-hidden="true" />
                        <span>Precisión total</span>
                    </div>
                </div>
            </div>
            {/* cards */}
            <div className="grid grid-cols-1 gap-6 w-full md:w-3/5">
                {/* Card 1 */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-heading text-neutral-800 font-bold">Card 1</h3>
                    <p className="text-md text-neutral-600">Description 1</p>
                </div>
                {/* Card 2 */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-heading text-neutral-800 font-bold">Card 2</h3>
                    <p className="text-md text-neutral-600">Description 2</p>
                </div>
                {/* Card 3 */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-heading text-neutral-800 font-bold">Card 3</h3>
                    <p className="text-md text-neutral-600">Description 3</p>
                </div>
            </div>
        </section>
    );
}