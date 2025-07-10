import { AlertCircle, ArrowRight, ExternalLink, MapPin } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { MAJOR_ROADS } from "@/constants/roads";

const SelectAreaCoverageCard = () => {
	return (
		<Card className="h-fit border-border/40 transition-colors duration-300 shadow-lg">
			<CardHeader className="pb-3">
				<CardTitle className="flex items-center gap-2.5">
					<MapPin
						className="w-5 h-5 text-blue-500 shrink-0"
						aria-hidden="true"
					/>
					<span className="text-lg font-semibold text-foreground">
						Area Berlaku
					</span>
				</CardTitle>
				<CardDescription className="text-base">
					Berdasarkan Pergub No. 88 Tahun 2019
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Road List */}
				<div className="bg-gradient-to-br from-gray-50/50 to-slate-50/50 dark:from-gray-900/20 dark:to-slate-900/20 rounded-lg">
					<div className="relative max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/10 hover:scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
						<div className="sticky top-0 right-0 z-10 flex justify-end p-2.5 bg-gradient-to-b from-gray-50/90 dark:from-gray-900/90">
							<div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 backdrop-blur-sm text-xs font-medium text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full border border-blue-200/20 dark:border-blue-500/10">
								Scroll untuk melihat lebih banyak
							</div>
						</div>
						<div className="p-4 pt-0 space-y-6">
							{Object.entries(MAJOR_ROADS).map(([region, roads]) => (
								<div key={region}>
									<div className="flex items-center gap-2.5 mb-3">
										<p className="text-sm font-medium text-blue-700 dark:text-blue-300">
											Jakarta {region.charAt(0).toUpperCase() + region.slice(1)}
										</p>
										<div className="h-px flex-1 bg-gradient-to-r from-blue-200/60 to-purple-200/60 dark:from-blue-700/30 dark:to-purple-700/30" />
									</div>
									<div className="grid grid-cols-1 gap-2 pl-1.5">
										{roads.map((road) => (
											<div
												key={road}
												className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors group"
											>
												<ArrowRight className="w-4 h-4 text-primary shrink-0" />
												<span>{road}</span>
											</div>
										))}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Additional Information */}
				<div className="grid gap-2.5">
					<div className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300 bg-gradient-to-br from-red-50/50 to-pink-50/50 dark:from-red-950/20 dark:to-pink-950/20 p-3.5 rounded-lg group hover:bg-white/60 dark:hover:bg-white/5">
						<AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
						<span className="group-hover:text-gray-900 dark:group-hover:text-gray-100">
							Pelanggaran dikenakan denda maksimal Rp500.000
						</span>
					</div>
					<div className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 p-3.5 rounded-lg group hover:bg-white/60 dark:hover:bg-white/5">
						<AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
						<span className="group-hover:text-gray-900 dark:group-hover:text-gray-100">
							Pengawasan dilakukan secara manual oleh Aparat Kepolisian dan
							tilang elektronik (ETLE)
						</span>
					</div>
					<div className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300 bg-gradient-to-br from-purple-50/50 to-violet-50/50 dark:from-purple-950/20 dark:to-violet-950/20 p-3.5 rounded-lg group hover:bg-white/60 dark:hover:bg-white/5">
						<AlertCircle className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
						<span className="group-hover:text-gray-900 dark:group-hover:text-gray-100">
							Diatur dalam pasal 287 UU Nomor 12 Tahun 2009 tentang Lalu Lintas
							dan Angkutan Jalan
						</span>
					</div>
				</div>

				{/* Official Link */}
				<div className="mt-6">
					<a
						href="https://www.jakarta.go.id/ganjil-genap"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-2.5 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline font-medium"
					>
						Informasi resmi
						<ExternalLink className="w-4 h-4 shrink-0" />
					</a>
				</div>
			</CardContent>
		</Card>
	);
};

export default SelectAreaCoverageCard;
