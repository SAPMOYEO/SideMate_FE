const ProjectCard = () => {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <div className="absolute top-4 right-4">
        <span className="text-primary rounded-full bg-white/90 px-3 py-1 text-xs font-bold tracking-wider uppercase shadow-sm backdrop-blur-sm">
          New
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-emerald-600 uppercase">
            Design
          </span>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs text-slate-500">1 month left</span>
        </div>
        <h3 className="group-hover:text-primary mb-2 text-lg font-bold text-slate-900 transition-colors dark:text-white">
          SocialConnect Mobile
        </h3>
        <p className="mb-6 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
          A privacy-focused social networking app for local communities. Seeking
          a Lead UI/UX Designer to refine the experience.
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
          <div className="flex -space-x-2">
            <img
              alt="Team member"
              className="h-8 w-8 rounded-full border-2 border-white dark:border-slate-900"
              data-alt="Portrait of a young woman with a neutral expression"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuChGkLumHQVx8sZ5_MQgV0kf8REszmc8WP6eGmCx0AQMjuuohbaqUvCKBaPytoQgcxu4XV6hpH3ILeyO1azKQvwII9VrQ5Uowao5Dh-4BvO0eadrj2TkA2ZXScnyg1F5swF8Y7cNNa-bhgyCNb0JW6ESZeKjb3Jzwz8RG3aDbmPZRT5e007VI28Bog0eGd6W3dkeiip52mxSqjYYmL-PafhBREWp9P0I6szcfcb3WW2k7S9UdJKtsbRtTvJ1piCVOGFWduJlg6YOOaN"
            />
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-[10px] font-bold text-slate-500 dark:border-slate-900 dark:bg-slate-800">
              +1
            </div>
          </div>
          <button className="text-primary flex items-center gap-1 text-sm font-bold">
            상세보기
            <span className="material-symbols-outlined text-sm">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProjectCard
